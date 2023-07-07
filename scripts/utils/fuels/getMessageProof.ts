import { MessageProof } from "../../types";

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

export async function getMessageProof(providerUrl: string, transactionId: string, messageId: string, blockId: string) {
    const result = await fetch(providerUrl, {
      method: 'POST',
      body: JSON.stringify({
        query: createQuery(transactionId, messageId, blockId),
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

    if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join('\n'));
    }

    return result.data.messageProof as MessageProof;
}
  