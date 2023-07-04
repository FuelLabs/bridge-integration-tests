import { formatEther, keccak256, parseEther, toUtf8Bytes } from 'ethers/lib/utils';
import { Address, BN, TransactionResultMessageOutReceipt, ZeroBytes32 } from 'fuels';
import { TestEnvironment, setupEnvironment } from '../scripts/setup';
import { constructTree, calcRoot, getProof } from '@fuel-ts/merkle';
import {
  BlockHeader,
  BlockHeaderLite,
  MessageOut,
  fuels_formatEther,
  fuels_parseEther,
  fuels_waitForMessage,
  mockBlockFinalization,
  generateBlockHeaderLite,
  computeBlockHash,
} from '../scripts/utils';

const ETH_AMOUNT = '0.1';
const FUEL_MESSAGE_TIMEOUT_MS = 1_000_000;
const FUEL_GAS_LIMIT = 500_000_000;
const FUEL_GAS_PRICE = 1;

// This script is a demonstration of how the base asset (ETH) is bridged to and from the Fuel chain
(async function () {
  // basic setup routine which creates the connections (the "providers") to both chains,
  // funds addresses for us to test with and populates the official contract deployments
  // on the Ethereum chain for interacting with the Fuel chain
  console.log('Setting up environment...');
  console.log('');
  const env: TestEnvironment = await setupEnvironment({});
  const ethereumAccount = env.eth.signers[0];
  const ethereumAccountAddress = await ethereumAccount.getAddress();
  const fuelAccount = env.fuel.signers[0];
  const fuelAccountAddress = fuelAccount.address.toHexString();
  const fuelMessagePortal = env.eth.fuelMessagePortal.connect(ethereumAccount);
  const fuelTxParams = {
    gasLimit: process.env.FUEL_GAS_LIMIT || FUEL_GAS_LIMIT,
    gasPrice: process.env.FUEL_GAS_PRICE || FUEL_GAS_PRICE,
  };

  /////////////////////////////
  // Bridge Ethereum -> Fuel //
  /////////////////////////////

  // note balances of both accounts before transfer
  console.log('Account balances:');
  console.log(`  Ethereum - ${formatEther(await ethereumAccount.getBalance())}  ETH (${ethereumAccountAddress})`);
  console.log(`  Fuel - ${fuels_formatEther(await fuelAccount.getBalance(ZeroBytes32))} ETH (${fuelAccountAddress})`);
  console.log('');

  // use the FuelMessagePortal to directly send ETH to the fuel account
  console.log(`Sending ${ETH_AMOUNT} ETH from Ethereum...`);
  const eSendTx = await fuelMessagePortal.depositETH(fuelAccountAddress, {
    value: parseEther(ETH_AMOUNT),
  });
  const eSendTxResult = await eSendTx.wait();
  if (eSendTxResult.status !== 1) {
    console.log(eSendTxResult);
    throw new Error('failed to call depositETH');
  }

  // parse events from logs to get the message nonce
  const event = fuelMessagePortal.interface.parseLog(eSendTxResult.logs[0]);
  const depositMessageNonce = new BN(event.args.nonce.toHexString());

  // wait for message to appear in fuel client
  console.log('Waiting for ETH to arrive on Fuel...');
  const depositMessage = await fuels_waitForMessage(
    env.fuel.provider,
    fuelAccount.address,
    depositMessageNonce,
    FUEL_MESSAGE_TIMEOUT_MS
  );
  if (depositMessage == null)
    throw new Error(`message took longer than ${FUEL_MESSAGE_TIMEOUT_MS}ms to arrive on Fuel`);
  console.log('');

  // the sent ETH is now spendable on Fuel
  console.log('ETH was bridged to Fuel successfully!!');

  // note balances of both accounts after transfer
  console.log('Account balances:');
  console.log(`  Ethereum - ${formatEther(await ethereumAccount.getBalance())} ETH (${ethereumAccountAddress})`);
  console.log(`  Fuel - ${fuels_formatEther(await fuelAccount.getBalance(ZeroBytes32))} ETH (${fuelAccountAddress})`);
  console.log('');

  /////////////////////////////
  // Bridge Fuel -> Ethereum //
  /////////////////////////////

  // withdraw ETH back to the base chain
  console.log(`Sending ${ETH_AMOUNT} ETH from Fuel...`);
  const fWithdrawTx = await fuelAccount.withdrawToBaseLayer(
    Address.fromString(ethereumAccountAddress),
    fuels_parseEther(ETH_AMOUNT),
    fuelTxParams
  );
  const fWithdrawTxResult = await fWithdrawTx.waitForResult();
  if (fWithdrawTxResult.status.type !== 'success') {
    console.log(fWithdrawTxResult);
    throw new Error('failed to withdraw ETH back to base layer');
  }

  // get message proof for relaying on Ethereum
  console.log('Building message proof...');
  const messageOutReceipt = <TransactionResultMessageOutReceipt>fWithdrawTxResult.receipts[0];

  // Build a new block to commit the message
  // TODO: we need to wait for the next block in another way when deploying to sepolia
  const resp = await fuelAccount.transfer(fuelAccount.address, 1);
  const result2 = await resp.waitForResult();

  const withdrawMessageProof = await env.fuel.provider.getMessageProof(
    fWithdrawTx.id, messageOutReceipt.messageId, result2.blockId
  );

  // construct data objects for relaying message on L1
  const messageOut: MessageOut = {
    sender: withdrawMessageProof.sender.toHexString(),
    recipient: withdrawMessageProof.recipient.toHexString(),
    amount: withdrawMessageProof.amount.toHex(),
    nonce: withdrawMessageProof.nonce,
    data: withdrawMessageProof.data,
  };
  const header = withdrawMessageProof.messageBlockHeader;
  const blockHeader: BlockHeader = {
    prevRoot: header.prevRoot,
    height: header.height.toHex(),
    timestamp: new BN(header.time).toHex(),
    daHeight: header.daHeight.toHex(),
    txCount: header.transactionsCount.toHex(),
    outputMessagesCount: header.transactionsCount.toHex(),
    txRoot: header.transactionsRoot,
    outputMessagesRoot: header.transactionsRoot,
  };
  const messageProof = withdrawMessageProof.messageProof;
  const messageInBlockProof = {
    key: messageProof.proofIndex.toNumber(),
    proof: messageProof.proofSet,
  };

  // create a simple merkle root and proof for the block
  // TODO: use the proof returned from Fuel instead
  const targetBlock = generateBlockHeaderLite(blockHeader);
  const targetBlockId = computeBlockHash(targetBlock);
  const prevRootNodes = constructTree([targetBlockId]);
  const prevRoot = calcRoot([targetBlockId]);
  
  // construct data objects for relaying message on L1 (cont)
  const rootHeader = withdrawMessageProof.commitBlockHeader;
  const rootBlockHeader: BlockHeaderLite = {
    prevRoot: prevRoot, // TODO: use 'rootHeader.prevRoot' instead
    height: "1", // TODO: use 'rootHeader.height.toHex()' instead
    timestamp: new BN(rootHeader.time).toHex(),
    applicationHash: rootHeader.applicationHash,
  };
  // const blockProof = withdrawMessageProof.blockProof;
  const blockInHistoryProof = {
    key: 0, // TODO: use 'blockProof.proofIndex.toNumber()' instead
    proof: getProof(prevRootNodes, 0), // TODO: use 'blockProof.proofSet' instead
  };

  // wait for block header finalization
  const committerRole = keccak256(toUtf8Bytes('COMMITTER_ROLE'));
  const deployerAddress = await env.eth.deployer.getAddress();
  const isDeployerComitter = await env.eth.fuelChainState.hasRole(committerRole, deployerAddress);
  if (isDeployerComitter) {
    // commit and finalize a mock block to prove the message from
    await mockBlockFinalization(env, rootBlockHeader);
  } else {
    // will need to wait for more blocks to be built and then a block to be comitted to the consensus contract
    throw new Error('Cannot make block commits');
  }

  // relay message on Ethereum
  console.log('Relaying message on Ethereum...');
  console.log(messageOut,
    rootBlockHeader,
    blockHeader,
    blockInHistoryProof,
    messageInBlockProof);
  const eRelayMessageTx = await fuelMessagePortal.relayMessage(
    messageOut,
    rootBlockHeader,
    blockHeader,
    blockInHistoryProof,
    messageInBlockProof
  );
  const eRelayMessageTxResult = await eRelayMessageTx.wait();
  if (eRelayMessageTxResult.status !== 1) {
    console.log(eRelayMessageTxResult);
    throw new Error('failed to call relayMessageFromFuelBlock');
  }
  console.log('');

  // the sent ETH is now spendable on Fuel
  console.log('ETH was bridged to Ethereum successfully!!');

  // note balances of both accounts after transfer
  console.log('Account balances:');
  console.log(`  Ethereum - ${formatEther(await ethereumAccount.getBalance())} ETH (${ethereumAccountAddress})`);
  console.log(`  Fuel - ${fuels_formatEther(await fuelAccount.getBalance(ZeroBytes32))} ETH (${fuelAccountAddress})`);
  console.log('');

  // done!
  console.log('');
  console.log('END');
  console.log('');
})();
