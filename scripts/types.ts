// TODO: remove this type once Fuel SDK is updated
export interface MessageProof {
  messageProof: BlockProof
  blockProof: BlockProof
  messageBlockHeader: BlockHeader
  commitBlockHeader: BlockHeader
  sender: string
  recipient: string
  nonce: string
  amount: string
  data: string
}

export interface BlockProof {
  proofSet: string[]
  proofIndex: string
}

export interface BlockHeader {
  id: string
  daHeight: string
  transactionsCount: string
  transactionsRoot: string
  height: string
  prevRoot: string
  time: string
  applicationHash: string
  messageReceiptRoot: string
  messageReceiptCount: string
}
// --->>> END TODO HERE <<<---


// The BlockHeader structure.
export type MessageBlockHeader = {
  prevRoot: string;
  height: string;
  timestamp: string;
  daHeight: string;
  txCount: string;
  outputMessagesCount: string;
  txRoot: string;
  outputMessagesRoot: string;
};

// The BlockHeader structure.
export type CommitBlockHeader = {
  prevRoot: string;
  height: string;
  timestamp: string;
  applicationHash: string;
};

// The MessageOut structure.
export type Message = {
  sender: string;
  recipient: string;
  amount: string;
  nonce: string;
  data: string;
};

export type Proof = {
  key: string;
  proof: Array<Uint8Array>;
};
