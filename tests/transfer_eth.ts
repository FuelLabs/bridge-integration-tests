import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers, BigNumber, Signer, utils, Signature } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { AbstractAddress, Address, BN, MessageProof, TransactionResultMessageOutReceipt, WalletUnlocked as FuelWallet } from 'fuels';
import { TestEnvironment, setupEnvironment } from '../scripts/setup';
import { fuels_parseEther, fuels_waitForMessage } from '../scripts/utils';

chai.use(solidity);
const { expect } = chai;

// The BlockHeader structure.
class BlockHeader {
	constructor(
		// Consensus
		public prevRoot: string,
		public height: number,
		public timestamp: number,

		// Application
		public daHeight: number,
		public txCount: number,
		public outputMessagesCount: number,
		public txRoot: string,
		public outputMessagesRoot: string
	) {}
}

// The MessageOutput structure.
class MessageOutput {
	constructor(
		public sender: string,
		public recipient: string,
		public amount: string,
		public nonce: string,
		public data: string
	) {}
}

describe('Transferring ETH', async function() {
	/*
	const ETH_ASSET_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";
	const DEFAULT_TIMEOUT_MS: number = 10_000;
	const FUEL_MESSAGE_TIMEOUT_MS: number = 15_000;

	let env: TestEnvironment;

	// override the default test timeout from 2000ms
	this.timeout(DEFAULT_TIMEOUT_MS);

	before(async () => {
		env = await setupEnvironment({});
	});

	describe('Send ETH to Fuel', async () => {
		const NUM_ETH = "0.1";
		let ethereumETHSender: Signer;
		let ethereumETHSenderAddress: string;
		let ethereumETHSenderBalance: BigNumber;
		let fuelETHReceiver: AbstractAddress;
		let fuelETHReceiverAddress: string;
		let fuelETHReceiverBalance: BN;
		let fuelETHMessageNonce: BN;
		before(async () => {
			ethereumETHSender = env.eth.signers[0];
			ethereumETHSenderAddress = await ethereumETHSender.getAddress();
			ethereumETHSenderBalance = await ethereumETHSender.getBalance();
			fuelETHReceiver = env.fuel.signers[0].address;
			fuelETHReceiverAddress = fuelETHReceiver.toHexString();
			fuelETHReceiverBalance = await env.fuel.provider.getBalance(fuelETHReceiver, ETH_ASSET_ID);
		});

		it('Send ETH via MessagePortal', async () => {
			// use the FuelMessagePortal to directly send ETH which should be immediately spendable
			let tx = await env.eth.fuelMessagePortal.connect(ethereumETHSender).sendETH(fuelETHReceiverAddress, {
				value: parseEther(NUM_ETH)
			});
			let result = await tx.wait();
			expect(result.status).to.equal(1);

			// parse events from logs
			let event = env.eth.fuelMessagePortal.interface.parseLog(result.logs[0]);
			fuelETHMessageNonce = new BN(event.args.nonce.toHexString());

			// check that the sender balance has decreased by the expected amount
			let newSenderBalance = await env.eth.provider.getBalance(ethereumETHSenderAddress);
			let ethereumETHSenderBalanceMinusGas = ethereumETHSenderBalance.sub(result.gasUsed.mul(result.effectiveGasPrice));
			expect(newSenderBalance.eq(ethereumETHSenderBalanceMinusGas.sub(parseEther(NUM_ETH)))).to.be.true;
		});

		it('Wait for ETH to arrive on Fuel', async function() {
			// override the default test timeout from 2000ms
			this.timeout(FUEL_MESSAGE_TIMEOUT_MS);

			// wait for message to appear in fuel client
			expect(await fuels_waitForMessage(env.fuel.provider, fuelETHReceiver, fuelETHMessageNonce, FUEL_MESSAGE_TIMEOUT_MS)).to.equal(true);

			// check that the recipient balance has increased by the expected amount
			let newReceiverBalance = await env.fuel.provider.getBalance(fuelETHReceiver, ETH_ASSET_ID);
			expect(newReceiverBalance.eq(fuelETHReceiverBalance.add(fuels_parseEther(NUM_ETH)))).to.be.true;
		});
	});

	describe('Send ETH from Fuel', async () => {
		const NUM_ETH = "0.1";
		let fuelETHSender: FuelWallet;
		let fuelETHSenderAddress: string;
		let fuelETHSenderBalance: BN;
		let ethereumETHReceiver: Signer;
		let ethereumETHReceiverAddress: string;
		let ethereumETHReceiverBalance: BigNumber;
		let withdrawMessageProof: MessageProof;
		before(async () => {
			fuelETHSender = env.fuel.signers[1];
			fuelETHSenderAddress = fuelETHSender.address.toHexString();
			fuelETHSenderBalance = await fuelETHSender.getBalance(ETH_ASSET_ID);
			ethereumETHReceiver = env.eth.signers[1];
			ethereumETHReceiverAddress = await ethereumETHReceiver.getAddress();
			ethereumETHReceiverBalance = await ethereumETHReceiver.getBalance();
		});

		it('Send ETH via OutputMessage', async () => {
			// withdraw ETH back to the base chain
			const tx = await fuelETHSender.withdrawToBaseLayer(Address.fromString(ethereumETHReceiverAddress), fuels_parseEther(NUM_ETH));
			const result = await tx.waitForResult();
			expect(result.status.type).to.equal('success');

			// get message proof
			const messageOutReceipt = <TransactionResultMessageOutReceipt>result.receipts[0];
			withdrawMessageProof = await env.fuel.provider.getMessageProof(tx.id, messageOutReceipt.messageID);

			// check that the sender balance has decreased by the expected amount
			let newSenderBalance = await fuelETHSender.getBalance(ETH_ASSET_ID);
			expect(newSenderBalance.eq(fuelETHSenderBalance.sub(fuels_parseEther(NUM_ETH)))).to.be.true;
		});

		it('Relay Message from Fuel on Ethereum', async () => {
			// construct relay message proof data
			//console.log(withdrawMessageProof)
			const messageOutput: MessageOutput = {
				sender: withdrawMessageProof.sender.toHexString(),
				recipient: withdrawMessageProof.recipient.toHexString(),
				amount: withdrawMessageProof.amount.toHex(),
				nonce: withdrawMessageProof.nonce,
				data: withdrawMessageProof.data,
			};
			const blockHeader: BlockHeader = {
				prevRoot: withdrawMessageProof.header.prevRoot,
				height: withdrawMessageProof.header.height.toNumber(),
				timestamp: Math.floor((new Date(withdrawMessageProof.header.time)).getTime() / 1000),
				daHeight: withdrawMessageProof.header.daHeight.toNumber(),
				txCount: withdrawMessageProof.header.transactionsCount.toNumber(),
				outputMessagesCount: withdrawMessageProof.header.outputMessagesCount.toNumber(),
				txRoot: withdrawMessageProof.header.transactionsRoot,
				outputMessagesRoot: withdrawMessageProof.header.outputMessagesRoot,
			};
			const messageInBlockProof = {
				key: withdrawMessageProof.proofIndex.toNumber(),
				proof: withdrawMessageProof.proofSet,
			};





			
			const messageId = computeMessageId(messageOutput);
			const messageNodes = constructTreeWithDigests([messageId]);
			const leafIndexKey = getLeafIndexKey(messageNodes, messageId);
			const root = calcRootWithDigests([messageId]);
			const messageInBlockProof2 = {
				key: leafIndexKey,
				proof: getProof(messageNodes, leafIndexKey),
			};
			//console.log(root)
			//console.log(messageInBlockProof)
			//console.log(messageInBlockProof2)

			const blockHeader2: BlockHeader = {
				prevRoot: withdrawMessageProof.header.prevRoot,
				height: withdrawMessageProof.header.height.toNumber(),
				timestamp: 0,
				daHeight: withdrawMessageProof.header.daHeight.toNumber(),
				txCount: withdrawMessageProof.header.transactionsCount.toNumber(),
				outputMessagesCount: 1,
				txRoot: withdrawMessageProof.header.transactionsRoot,
				outputMessagesRoot: root,
			};



			//good//console.log(computeApplicationHeaderHash(blockHeader))//console.log(withdrawMessageProof.header.applicationHash)
			//console.log((new Date(withdrawMessageProof.header.time)).getTime())
			const poaSigner = new ethers.Wallet("0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298", env.eth.provider);
			const blockId = computeBlockId(blockHeader2);
			const blockSignature = await compactSign(poaSigner, blockId);
			//console.log(blockSignature)
			//console.log(withdrawMessageProof.signature)

			// relay message
			await expect(
				env.eth.fuelMessagePortal.relayMessageFromFuelBlock(
					messageOutput,
					blockHeader2,
					messageInBlockProof2,
					blockSignature
				)
			).to.not.be.reverted;
		});

		it('Check ETH arrived on Ethereum', async () => {
			// check that the recipient balance has increased by the expected amount
			let newReceiverBalance = await ethereumETHReceiver.getBalance();
			expect(newReceiverBalance.eq(ethereumETHReceiverBalance.add(parseEther(NUM_ETH)))).to.be.true;
		});
	});
	*/
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// compute root wth digests
export function calcRootWithDigests(digests: string[]): string {
	if (digests.length === 0) {
		return "";
	}
	const nodes = [];
	for (let i = 0; i < digests.length; i += 1) {
		const hashed = digests[i];
		nodes.push(new Node(-1, -1, -1, hashed, digests[i]));
	}
	let pNodes = nodes;
	let size = (nodes.length + 1) >> 1;
	let odd = nodes.length & 1;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		let i = 0;
		for (; i < size - odd; i += 1) {
			const j = i << 1;
			const hashed = nodeDigest(pNodes[j].hash, pNodes[j + 1].hash);
			nodes[i] = new Node(pNodes[j].index, pNodes[j + 1].index, -1, hashed, '');
		}
		if (odd === 1) {
			nodes[i] = pNodes[i << 1];
		}
		if (size === 1) {
			break;
		}
		odd = size & 1;
		size = (size + 1) >> 1;
		pNodes = nodes;
	}
	return nodes[0].hash;
}
// get proof for the leaf
export function getProof(nodes: Node[], id: number): string[] {
	// const proof = new Proof([]);
	const proof: string[] = [];
	for (let prev = id, cur = nodes[id].parent; cur !== -1; prev = cur, cur = nodes[cur].parent) {
		if (nodes[cur].left === prev) {
			proof.push(nodes[nodes[cur].right].hash);
		} else {
			proof.push(nodes[nodes[cur].left].hash);
		}
	}
	return proof;
}
// get proof for the leaf
function getLeafIndexKey(nodes: Node[], data: string): number {
	for (let n = 0; n < nodes.length; n += 1) {
		if (nodes[n].data === data) {
			return nodes[n].index;
		}
	}
	return 0;
}

class Node {
	left: number;

	right: number;

	parent: number;

	index: number;

	hash: string;

	data: string;

	constructor(left: number, right: number, parent: number, hash: string, data: string) {
		this.left = left;
		this.right = right;
		this.parent = parent;
		this.hash = hash;
		this.data = data;
		this.index = 0;
	}
}

export function nodeDigest(left: string, right: string): string {
	// Slice off the '0x' on each argument to simulate abi.encodePacked
	// hash(prefix +  left + right)
	return utils.sha256('0x01'.concat(left.slice(2)).concat(right.slice(2)));
}

// construct tree from digests
export function constructTreeWithDigests(digests: string[]): Node[] {
	const nodes = [];
	for (let i = 0; i < digests.length; i += 1) {
		const hashed = digests[i];
		const leaf = new Node(-1, -1, -1, hashed, digests[i]);
		leaf.index = i;
		nodes.push(leaf);
	}

	const nodesList = [...nodes];
	let pNodes = [...nodes];

	let size = (nodes.length + 1) >> 1;
	let odd = nodes.length & 1;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		let i = 0;
		for (; i < size - odd; i += 1) {
			const j = i << 1;
			const hashed = nodeDigest(pNodes[j].hash, pNodes[j + 1].hash);
			nodes[i] = new Node(pNodes[j].index, pNodes[j + 1].index, -1, hashed, '');
			const nextIndex = nodesList.length;
			nodes[i].index = nextIndex;

			nodesList[pNodes[j].index].parent = nextIndex;
			nodesList[pNodes[j + 1].index].parent = nextIndex;
			nodesList.push(nodes[i]);
		}

		if (size === 1) {
			break;
		}

		if (odd === 1) {
			nodes[i] = pNodes[i << 1];
		}

		odd = size & 1;
		size = (size + 1) >> 1;
		pNodes = [...nodes];
	}
	return nodesList;
}

function computeMessageId(message: MessageOutput): string {
	return utils.sha256(
		ethers.utils.solidityPack(
			['bytes32', 'bytes32', 'bytes32', 'uint64', 'bytes'],
			[message.sender, message.recipient, message.nonce, message.amount, message.data]
		)
	);
}

// Serialize a block application header.
export function serializeApplicationHeader(blockHeader: BlockHeader): string {
	return utils.solidityPack(
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
	return utils.sha256(serializeApplicationHeader(blockHeader));
}

// Serialize a block consensus header.
export function serializeConsensusHeader(blockHeader: BlockHeader): string {
	return utils.solidityPack(
		['bytes32', 'uint64', 'uint64', 'bytes32'],
		[
			blockHeader.prevRoot,
			blockHeader.height,
			blockHeader.timestamp,
			computeApplicationHeaderHash(blockHeader),
		]
	);
}

// Produce the block consensus header hash.
export function computeConsensusHeaderHash(blockHeader: BlockHeader): string {
	return utils.sha256(serializeConsensusHeader(blockHeader));
}

// Produce the block ID (aka the consensus header hash).
export function computeBlockId(blockHeader: BlockHeader): string {
	return computeConsensusHeaderHash(blockHeader);
}



// Sign a messag with a signer, returning the signature object (v, r, s components)
export async function componentSign(signer: Signer, message: string): Promise<Signature> {
	const flatSig = await signer.signMessage(ethers.utils.arrayify(message));
	const sig = ethers.utils.splitSignature(flatSig);
	return sig;
}

// Sign a message with as signer, returning a 64-byte compact ECDSA signature
export async function compactSign(signer: Signer, message: string): Promise<string> {
	const sig = await componentSign(signer, message);
	// eslint-disable-next-line no-underscore-dangle
	const compactSig = sig.r.concat(sig._vs.slice(2));
	return compactSig;
}
