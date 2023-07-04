const createQuery = (transactionId: string, messageId: string, commitBlockId: string) => `
fragment messageProofFragment on MessageProof {
    messageProof {
        proofSet
        proofIndex
    }
    blockProof {
        proofSet
        proofIndex
    }
    messageBlockHeader {
        id
        daHeight
        transactionsCount
        transactionsRoot
        height
        prevRoot
        time
        applicationHash
        messageReceiptRoot
        messageReceiptCount
    }
    commitBlockHeader {
        id
        daHeight
        transactionsCount
        transactionsRoot
        height
        prevRoot
        time
        applicationHash
        messageReceiptRoot
        messageReceiptCount
    }
    sender
    recipient
    nonce
    amount
    data
}

query {
    messageProof(
        transactionId:"${transactionId}",
        messageId: "${messageId}",
        commitBlockId: "${commitBlockId}"
    ) {
        ...messageProofFragment
    }
}`;

export interface Root {
    data: Data
  }
  
  export interface Data {
    messageProof: MessageProof
  }
  
  export interface MessageProof {
    messageProof: MessageProof2
    blockProof: BlockProof
    messageBlockHeader: MessageBlockHeader
    commitBlockHeader: CommitBlockHeader
    sender: string
    recipient: string
    nonce: string
    amount: string
    data: string
  }
  
  export interface MessageProof2 {
    proofSet: string[]
    proofIndex: string
  }
  
  export interface BlockProof {
    proofSet: string[]
    proofIndex: string
  }
  
  export interface MessageBlockHeader {
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
  
  export interface CommitBlockHeader {
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
  
  
export async function getMessageProof(transactionId: string, messageId: string, blockId: string) {
    const result = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: createQuery(transactionId, messageId, blockId),
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

    return result.data.messageProof as MessageProof;
}
  