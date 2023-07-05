/// @dev The Fuel testing utils.
/// A set of useful helper methods for the integration test environment.
import {
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
} from 'fuels';


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

// Relay commonly used messages with predicates spendable by anyone
export async function relayCommonMessage(
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