import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber, ethers, Signature, Signer, utils } from 'ethers';
import { ContractFactory } from '@fuel-ts/contract';
import { join } from 'path';
import { readFileSync } from 'fs';
import { TestEnvironment, setupEnvironment } from '../scripts/setup';
import { Token } from '../fuel-v2-contracts/Token.d';
import { Token__factory } from '../fuel-v2-contracts/factories/Token__factory';
import FuelFungibleTokenContractABI_json from "../bridge-fungible-token/bridge_fungible_token-abi.json";
import { AbstractAddress, Address, BN, Contract, MessageProof, OutputType, TransactionResultMessageOutReceipt, WalletUnlocked as FuelWallet } from 'fuels';
import { fuels_waitForMessage } from '../scripts/utils';

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

describe('Bridging ERC20 tokens', async function() {
	const DEFAULT_TIMEOUT_MS: number = 10_000;
	const FUEL_MESSAGE_TIMEOUT_MS: number = 15_000;
	const DECIMAL_DIFF = 1_000_000_000;

	let env: TestEnvironment;
	let eth_testToken: Token;
	let fuel_testToken: Contract;
	let fuel_testTokenId: string;

	// override the default test timeout from 2000ms
	this.timeout(DEFAULT_TIMEOUT_MS);

	before(async () => {
		env = await setupEnvironment({});
	});

	it('Setup tokens to bridge', async () => {
		// TODO: use config time values in sway contracts so we don't have to hardcode 
		// these values and can create a new test token contract each time
		const expectedGatewayContractId = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
		const expectedTokenContractId = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

		// create test ERC20 contract
		try {
			eth_testToken = Token__factory.connect(expectedTokenContractId, env.eth.deployer);
			await eth_testToken.totalSupply();
		} catch (e) {
			const eth_tokenFactory = new Token__factory(env.eth.deployer);
			eth_testToken = await eth_tokenFactory.deploy();
			await eth_testToken.deployed();
		}

		// check that values for the test token and gateway contract match what 
		// was compiled into the bridge-fungible-token binaries
		expect(env.eth.l1ERC20Gateway.address).to.equal(expectedGatewayContractId);
		expect(eth_testToken.address).to.equal(expectedTokenContractId);
		expect(await eth_testToken.decimals()).to.equal(18);

		// mint tokens as starting balances
		await expect(eth_testToken.mint(await env.eth.deployer.getAddress(), 10_000)).to.not.be.reverted;
		await expect(eth_testToken.mint(await env.eth.signers[0].getAddress(), 10_000)).to.not.be.reverted;
		await expect(eth_testToken.mint(await env.eth.signers[1].getAddress(), 10_000)).to.not.be.reverted;
	
		// setup fuel client and setup l2 side contract for ERC20
		const bytecode = readFileSync(join(__dirname, '../bridge-fungible-token/bridge_fungible_token.bin'));
		const factory = new ContractFactory(bytecode, FuelFungibleTokenContractABI_json, env.fuel.deployer);
		fuel_testToken = await factory.deployContract();
		fuel_testTokenId = fuel_testToken.id.toHexString();
	});

	describe('Bridge ERC20 to Fuel', async () => {
		const NUM_TOKENS = 10_000_000_000;
		let ethereumTokenSender: Signer;
		let ethereumTokenSenderAddress: string;
		let ethereumTokenSenderBalance: BigNumber;
		let fuelTokenReceiver: AbstractAddress;
		let fuelTokenReceiverAddress: string;
		let fuelTokenReceiverBalance: BN;
		let fuelTokenMessageNonce: BN;
		let fuelTokenMessageReceiver: AbstractAddress;
		before(async () => {
			ethereumTokenSender = env.eth.signers[0];
			ethereumTokenSenderAddress = await ethereumTokenSender.getAddress();
			await eth_testToken.mint(ethereumTokenSenderAddress, NUM_TOKENS);
			ethereumTokenSenderBalance = await eth_testToken.balanceOf(ethereumTokenSenderAddress);
			fuelTokenReceiver = env.fuel.signers[0].address;
			fuelTokenReceiverAddress = fuelTokenReceiver.toHexString();
			fuelTokenReceiverBalance = await env.fuel.provider.getBalance(fuelTokenReceiver, fuel_testTokenId);
		});

		it('Bridge ERC20 via L1ERC20Gateway', async () => {
			// approve l1 side gateway to spend the tokens
			await expect(eth_testToken.connect(ethereumTokenSender).approve(env.eth.l1ERC20Gateway.address, NUM_TOKENS)).to.not.be.reverted;

			// use the L1ERC20Gateway to deposit test tokens and receive equivalent tokens on Fuel
			let tx = await env.eth.l1ERC20Gateway.connect(ethereumTokenSender).deposit(fuelTokenReceiverAddress, eth_testToken.address, fuel_testTokenId, NUM_TOKENS);
			let result = await tx.wait();
			expect(result.status).to.equal(1);

			// parse events from logs
			let event = env.eth.fuelMessagePortal.interface.parseLog(result.logs[2]);
			fuelTokenMessageNonce = new BN(event.args.nonce.toHexString());
			fuelTokenMessageReceiver = Address.fromB256(event.args.recipient);

			// check that the sender balance has decreased by the expected amount
			let newSenderBalance = await eth_testToken.balanceOf(ethereumTokenSenderAddress);
			expect(newSenderBalance.eq(ethereumTokenSenderBalance.sub(NUM_TOKENS))).to.be.true;
		});

		it('Wait for ERC20 to arrive on Fuel', async function() {
			// override the default test timeout from 2000ms
			this.timeout(FUEL_MESSAGE_TIMEOUT_MS);

			// wait for message to appear in fuel client and be executed automatically
			expect(await fuels_waitForMessage(env.fuel.provider, fuelTokenMessageReceiver, fuelTokenMessageNonce, FUEL_MESSAGE_TIMEOUT_MS, true)).to.equal(true);

			// check that the recipient balance has increased by the expected amount
			let newReceiverBalance = await env.fuel.provider.getBalance(fuelTokenReceiver, fuel_testTokenId);
			expect(newReceiverBalance.eq(fuelTokenReceiverBalance.add(NUM_TOKENS/DECIMAL_DIFF))).to.be.true;
		});
	});

	describe('Bridge ERC20 from Fuel', async () => {
		const NUM_TOKENS = 10_000_000_000;
		let fuelTokenSender: FuelWallet;
		let fuelTokenSenderAddress: string;
		let fuelTokenSenderBalance: BN;
		let ethereumTokenReceiver: Signer;
		let ethereumTokenReceiverAddress: string;
		let ethereumTokenReceiverBalance: BigNumber;
		let withdrawMessageProof: MessageProof;
		before(async () => {
			fuelTokenSender = env.fuel.signers[0];
			fuelTokenSenderAddress = fuelTokenSender.address.toHexString();
			fuelTokenSenderBalance = await fuelTokenSender.getBalance(fuel_testTokenId);
			ethereumTokenReceiver = env.eth.signers[0];
			ethereumTokenReceiverAddress = await ethereumTokenReceiver.getAddress();
			ethereumTokenReceiverBalance = await eth_testToken.balanceOf(ethereumTokenReceiverAddress);
		});

		it('Bridge ERC20 via Fuel token contract', async () => {
			// withdraw tokens back to the base chain
			fuel_testToken.wallet = fuelTokenSender;
			const paddedAddress = "0x" + ethereumTokenReceiverAddress.slice(2).padStart(64, "0");
			const scope = await fuel_testToken.functions
				.withdraw_to(paddedAddress)
				.callParams({
					forward: { amount: NUM_TOKENS/DECIMAL_DIFF, assetId: fuel_testTokenId },
				})
				.fundWithRequiredCoins();
			scope.transactionRequest.addMessageOutputs(1);
			const tx = await fuelTokenSender.sendTransaction(scope.transactionRequest);
			const result = await tx.waitForResult();
			expect(result.status.type).to.equal('success');

			// get message proof
			const messageOutReceipt = <TransactionResultMessageOutReceipt>result.receipts[1];
			withdrawMessageProof = await env.fuel.provider.getMessageProof(tx.id, messageOutReceipt.messageID);

			// check that the sender balance has decreased by the expected amount
			let newSenderBalance = await fuelTokenSender.getBalance(fuel_testTokenId);
			expect(newSenderBalance.eq(fuelTokenSenderBalance.sub(NUM_TOKENS/DECIMAL_DIFF))).to.be.true;
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
				proof: withdrawMessageProof.proofSet.slice(0, -1),
			};




			//temporary rebuilding of the block header with new signature
			const blockHeader2: BlockHeader = {
				prevRoot: withdrawMessageProof.header.prevRoot,
				height: withdrawMessageProof.header.height.toNumber(),
				timestamp: 0,
				daHeight: withdrawMessageProof.header.daHeight.toNumber(),
				txCount: withdrawMessageProof.header.transactionsCount.toNumber(),
				outputMessagesCount: withdrawMessageProof.header.outputMessagesCount.toNumber(),
				txRoot: withdrawMessageProof.header.transactionsRoot,
				outputMessagesRoot: withdrawMessageProof.header.outputMessagesRoot,
			};
			const poaSigner = new ethers.Wallet("0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298", env.eth.provider);
			const blockId = computeBlockId(blockHeader2);
			const blockSignature = await compactSign(poaSigner, blockId);




			// relay message
			await expect(
				env.eth.fuelMessagePortal.relayMessageFromFuelBlock(
					messageOutput,
					blockHeader2,
					messageInBlockProof,
					blockSignature
				)
			).to.not.be.reverted;
		});

		it('Check ERC20 arrived on Ethereum', async () => {
			// check that the recipient balance has increased by the expected amount
			let newReceiverBalance = await eth_testToken.balanceOf(ethereumTokenReceiverAddress);
			expect(newReceiverBalance.eq(ethereumTokenReceiverBalance.add(NUM_TOKENS))).to.be.true;
		});
	});
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
