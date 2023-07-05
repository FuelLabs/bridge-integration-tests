import { arrayify } from 'fuels';
import {
    MessageProof,
    Message,
    MessageBlockHeader,
    CommitBlockHeader,
    Proof,
} from '../../types';

export function createRelayMessageParams(withdrawMessageProof: MessageProof) {
    // construct data objects for relaying message on L1
  const message: Message = {
    sender: withdrawMessageProof.sender,
    recipient: withdrawMessageProof.recipient,
    amount: withdrawMessageProof.amount,
    nonce: withdrawMessageProof.nonce,
    data: withdrawMessageProof.data,
  };
  const header = withdrawMessageProof.messageBlockHeader;
  const blockHeader: MessageBlockHeader = {
    prevRoot: header.prevRoot,
    height: header.height,
    timestamp: header.time,
    daHeight: header.daHeight,
    txCount: header.transactionsCount,
    txRoot: header.transactionsRoot,
    outputMessagesRoot: header.messageReceiptRoot,
    outputMessagesCount: header.messageReceiptCount,
  };
  const messageProof = withdrawMessageProof.messageProof;
  const messageProofSet = messageProof.proofSet;
  // TODO: update this when fuel-core remove the first proof from the set
  messageProofSet.shift();
  // Create the message proof object
  const messageInBlockProof: Proof = {
    key: messageProof.proofIndex,
    proof: messageProofSet.map((p) => arrayify(p)),
  };

  // construct data objects for relaying message on L1 (cont)
  const rootHeader = withdrawMessageProof.commitBlockHeader;
  const rootBlockHeader: CommitBlockHeader = {
    prevRoot: rootHeader.prevRoot,
    height: rootHeader.height,
    timestamp: rootHeader.time,
    applicationHash: rootHeader.applicationHash,
  };
  const blockProof = withdrawMessageProof.blockProof;
  let proofSet = blockProof.proofSet;
  // TODO: update this when fuel-core remove the first proof from the set
  proofSet.shift();
  // Create the block proof object
  const blockInHistoryProof: Proof = {
    key: blockProof.proofIndex,
    proof: proofSet.map((p) => arrayify(p)),
  };

  return {
    message,
    rootBlockHeader,
    blockHeader,
    blockInHistoryProof,
    messageInBlockProof
  };
}