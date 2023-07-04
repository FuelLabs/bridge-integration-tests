/// @dev The Fuel testing utils.
/// A set of useful helper methods for the integration test environment.
import { ethers, BigNumber } from 'ethers';
import { sha256, solidityPack } from 'ethers/lib/utils';
import { constructTree, calcRoot, getProof } from '@fuel-ts/merkle';
import {
  Provider as FuelProvider,
  BN,
  AbstractAddress,
  Message,
  WalletUnlocked as FuelWallet,
  ZeroBytes32,
  ScriptTransactionRequest,
  TransactionRequestLike,
  arrayify,
  InputType,
  hexlify,
  OutputType,
  TransactionResponse,
  bn,
  MessageProof,
  randomBytes,
  NativeAssetId,
  Address,
} from 'fuels';
import { FuelMessagePortal } from '../fuel-v2-contracts/FuelMessagePortal';
import { TestEnvironment } from './setup';
import * as http from 'http';
import * as https from 'https';
import * as url from 'url';


// Constants
const ETHEREUM_ETH_DECIMALS: number = 18;
const FUEL_ETH_DECIMALS: number = 9;
const FUEL_MESSAGE_POLL_MS: number = 300;
const MAX_GAS_PER_TX = bn(100000000);

// Parse ETH value as a string
export function fuels_parseEther(ether: string): BN {
  let val = ethers.utils.parseEther(ether);
  val = val.div(10 ** (ETHEREUM_ETH_DECIMALS - FUEL_ETH_DECIMALS));
  return new BN(val.toHexString());
}

// Format ETH value to a string
export function fuels_formatEther(ether: BN): string {
  let val = BigNumber.from(ether.toHex());
  val = val.mul(10 ** (ETHEREUM_ETH_DECIMALS - FUEL_ETH_DECIMALS));
  return ethers.utils.formatEther(val);
}

// Parse any string value using the given decimal amount
export function fuels_parseToken(value: string, decimals: number = 9): BN {
  let val = ethers.utils.parseEther(value);
  val = val.div(10 ** (ETHEREUM_ETH_DECIMALS - decimals));
  return new BN(val.toHexString());
}

// Format any value to a string using the given decimal amount
export function fuels_formatToken(value: BN, decimals: number = 9): string {
  let val = BigNumber.from(value.toHex());
  val = val.mul(10 ** (ETHEREUM_ETH_DECIMALS - decimals));
  return ethers.utils.formatEther(val);
}

// Parse any string value using the given decimal amount
export function ethers_parseToken(value: string, decimals: number = 18): BigNumber {
  let val = ethers.utils.parseEther(value);
  return val.div(10 ** (ETHEREUM_ETH_DECIMALS - decimals));
}

// Format any value to a string using the given decimal amount
export function ethers_formatToken(value: BigNumber, decimals: number = 18): string {
  value = value.mul(10 ** (ETHEREUM_ETH_DECIMALS - decimals));
  return ethers.utils.formatEther(value);
}

// Wait until a message is present in the fuel client
export async function fuels_waitForMessage(
  provider: FuelProvider,
  recipient: AbstractAddress,
  nonce: BN,
  timeout: number
): Promise<Message> {
  let startTime = new Date().getTime();
  while (new Date().getTime() - startTime < timeout) {
    let messages = await provider.getMessages(recipient, { first: 1000 });
    for (let message of messages) {
      if (message.nonce.toString() === nonce.toHex(32).toString()) {
        return message;
      }
    }
    await delay(FUEL_MESSAGE_POLL_MS);
  }
  return null;
}

// Relay commonly used messages with predicates spendable by anyone
export async function fuels_relayCommonMessage(
  relayer: FuelWallet,
  message: Message,
  txParams: Pick<TransactionRequestLike, 'gasLimit' | 'gasPrice' | 'maturity'> = {}
): Promise<TransactionResponse> {
  // find the relay details for the specified message
  let messageRelayDetails: CommonMessageDetails = null;
  for (let details of COMMON_RELAYABLE_MESSAGES) {
    if (details.predicateRoot == message.recipient.toHexString()) {
      messageRelayDetails = details;
      break;
    }
  }
  if (messageRelayDetails == null) throw new Error('message is not a common relayable message');

  // build and send transaction
  let transaction = await messageRelayDetails.buildTx(relayer, message, messageRelayDetails, txParams);
  return relayer.sendTransaction(transaction);
}

// Makes sure the latest Fuel block is comitted to the consensus contract and is considered finalized
export async function mockBlockFinalization(
  env: TestEnvironment,
  commitBlock: BlockHeaderLite
) {
  const BLOCKS_PER_COMMIT_INTERVAL = 10800;
  const TIME_TO_FINALIZE = 10800;

  // connect to FuelChainState contract as the permissioned block comitter
  const fuelChainState = env.eth.fuelChainState.connect(env.eth.deployer);

  // commit the given block
  console.log('blockHash:', computeBlockHash(commitBlock));
  const commitBlockTx = await fuelChainState.commit(
    computeBlockHash(commitBlock),
    Math.floor(bn(commitBlock.height).toNumber() / BLOCKS_PER_COMMIT_INTERVAL)
  );
  const commitBlockTxResult = await commitBlockTx.wait();
  if (commitBlockTxResult.status !== 1) {
    console.log(commitBlockTxResult);
    throw new Error('failed to call commit on block');
  }

  // move the clock forward to ensure finalization
  // TODO: for public test nets this call should fail, when that happens do a simple delay instead [await delay(5*60*1000);]
  await providerSend(env.eth.jsonRPC, 'evm_increaseTime', [TIME_TO_FINALIZE]);
  //env.eth.provider.send('evm_increaseTime', [TIME_TO_FINALIZE]);
  //curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' 127.0.0.1:8545
}

// Makes a low level JSON RPC method call
export function providerSend(jsonRPC: string, method: string, params: [any]) {
  let u = url.parse(jsonRPC, true);
  const data = {
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: 0,
  };

  return new Promise(function (resolve, reject) {
    let opt = {
      host: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let cb = function (res) {
      res.setEncoding('utf8');
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }

      var ret = '';
      res.on('data', (chunk) => {
        ret += chunk;
      });
      res.on('end', () => {
        try {
          ret = JSON.parse(ret);
        } catch (e) {
          reject(e);
        }
        resolve(ret);
      });
    };
    let req = u.protocol == 'http:' ? http.request(opt, cb) : https.request(opt, cb);
    req.on('error', (err) => reject(err));

    req.write(JSON.stringify(data));
    req.end();
  });
}

// Produce the block consensus header hash
export function computeBlockHash(blockHeader: BlockHeaderLite): string {
  const serialized = solidityPack(
    ['bytes32', 'uint32', 'uint64', 'bytes32'],
    [blockHeader.prevRoot, blockHeader.height, blockHeader.timestamp, blockHeader.applicationHash]
  );
  return sha256(serialized);
}

// Generates the lite version of the block header.
export function generateBlockHeaderLite(blockHeader: BlockHeader): BlockHeaderLite {
  const header: BlockHeaderLite = {
      prevRoot: blockHeader.prevRoot,
      height: blockHeader.height,
      timestamp: blockHeader.timestamp,
      applicationHash: computeApplicationHeaderHash(blockHeader),
  };

  return header;
}

// Serialize a block application header.
export function serializeApplicationHeader(blockHeader: BlockHeader): string {
    return solidityPack(
        ['uint64', 'uint64', 'uint64', 'bytes32', 'bytes32'],
        [
            blockHeader.daHeight,
            blockHeader.txCount,
            blockHeader.outputMessagesCount,
            blockHeader.txRoot,
            blockHeader.outputMessagesRoot,
        ]
    );
}

// Produce the block application header hash.
export function computeApplicationHeaderHash(blockHeader: BlockHeader): string {
    return ethers.utils.sha256(serializeApplicationHeader(blockHeader));
}

// Simple async delay function
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The BlockHeader structure.
export class BlockHeader {
  constructor(
    // Consensus
    public prevRoot: string,
    public height: string,
    public timestamp: string,

    // Application
    public daHeight: string,
    public txCount: string,
    public outputMessagesCount: string,
    public txRoot: string,
    public outputMessagesRoot: string
  ) {}
}

// The BlockHeader structure.
export class BlockHeaderLite {
  constructor(
    public prevRoot: string,
    public height: string,
    public timestamp: string,
    public applicationHash: string
  ) {}
}

// The MessageOut structure.
export class MessageOut {
  constructor(
    public sender: string,
    public recipient: string,
    public amount: string,
    public nonce: string,
    public data: string
  ) {}
}

// Details for relaying common messages with certain predicate roots
const COMMON_RELAYABLE_MESSAGES: CommonMessageDetails[] = [
  {
    name: 'Message To Contract v1.3',
    predicateRoot: '0x6767333817034bfdf74f68bfdb4130438e7ce65a9e4cbadba6b490a265f094dc',
    predicate:
      '0x1A405000910000206144000B6148000540411480504CC04C72580020295134165B501012615C000772680002595D7001616171015B61A0106165711A5B6400125B5C100B2404000024000000664E627BFC0DB0BFA8F182EFC913B552681143E328B555D9697C40AD0EB527AD',
    script: '0x1A40500091000050504500205049102461540117614C011D5050C02C60453020604940042D45540A240000009532D7AE',
    buildTx: async (
      relayer: FuelWallet,
      message: Message,
      details: CommonMessageDetails,
      txParams: Pick<TransactionRequestLike, 'gasLimit' | 'gasPrice' | 'maturity'>
    ): Promise<ScriptTransactionRequest> => {
      //TODO: minGas should be much lower and more in line with what the predicate actually verifies (currently 1200000)
      const minGas: number = 500000000000;
      const script = arrayify(details.script);
      const predicate = arrayify(details.predicate);

      // find a UTXO that can cover gas costs
      let coins = (await relayer.getCoins()).filter(
        (coin) => coin.assetId == ZeroBytes32 && coin.amount.gt(minGas)
      );
      if (coins.length == 0) throw new Error('wallet has no single UTXO that can cover gas costs');
      let gas_coin = coins[0];

      // get contract id
      const data = arrayify(message.data);
      if (data.length < 32) throw new Error('cannot find contract ID in message data');
      const contractId = hexlify(data.slice(0, 32));

      // build the transaction
      const transaction = new ScriptTransactionRequest({ script, gasLimit: minGas, ...txParams });
      transaction.inputs.push({
        type: InputType.Message,
        amount: message.amount,
        sender: message.sender.toHexString(),
        recipient: message.recipient.toHexString(),
        witnessIndex: 0,
        // data: message.data,
        nonce: message.nonce,
        predicate: predicate,
      });
      transaction.inputs.push({
        type: InputType.Contract,
        txPointer: ZeroBytes32,
        contractId: contractId,
      });
      transaction.inputs.push({
        type: InputType.Coin,
        id: gas_coin.id,
        owner: hexlify(gas_coin.owner.toBytes()),
        amount: gas_coin.amount,
        assetId: ZeroBytes32,
        txPointer: ZeroBytes32,
        witnessIndex: 0,
      });
      transaction.outputs.push({
        type: OutputType.Contract,
        inputIndex: 1,
      });
      transaction.outputs.push({
        type: OutputType.Change,
        to: hexlify(gas_coin.owner.toBytes()),
        assetId: ZeroBytes32,
      });
      transaction.outputs.push({
        type: OutputType.Variable,
      });
      transaction.witnesses.push('0x');

      console.log("-------------------------------------------------------------------");
      console.log(transaction.inputs);
      console.log("-------------------------------------------------------------------");
      console.log(transaction.outputs);
      console.log("-------------------------------------------------------------------");
      

      return transaction;
    },
  },
];
type CommonMessageDetails = {
  name: string;
  predicateRoot: string;
  predicate: string;
  script: string;
  buildTx: (
    relayer: FuelWallet,
    message: Message,
    details: CommonMessageDetails,
    txParams: Pick<TransactionRequestLike, 'gasLimit' | 'gasPrice' | 'maturity'>
  ) => Promise<ScriptTransactionRequest>;
};
