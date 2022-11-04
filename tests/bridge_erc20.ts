import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber, ethers, Signer } from 'ethers';
import { ContractFactory } from '@fuel-ts/contract';
import { join } from 'path';
import { readFileSync } from 'fs';
import { TestEnvironment, setupEnvironment } from '../scripts/setup';
import { Token } from '../fuel-v2-contracts/Token.d';
import { Token__factory } from '../fuel-v2-contracts/factories/Token__factory';
import FuelFungibleTokenContractABI_json from "../bridge-fungible-token/bridge_fungible_token-abi.json";
import { AbstractAddress, Address, BN, Contract } from 'fuels';
import { fuels_waitForMessage } from '../scripts/utils';

chai.use(solidity);
const { expect } = chai;

describe('Bridging ERC20 tokens', async () => {
	const FUEL_MESSAGE_TIMEOUT_MS: number = 10_000;

	let env: TestEnvironment;
	let ethAccountAddress: string;
	let eth_testToken: Token;
	let fuel_testToken: Contract;
	let fuel_testTokenId: string;

	before(async () => {
		env = await setupEnvironment({});
		ethAccountAddress = await env.eth.signers[0].getAddress();
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

		// mint tokens for bridging
		await expect(eth_testToken.mint(ethAccountAddress, 1000)).to.not.be.reverted;

		// approve l1 side gateway to spend the tokens
		await expect(eth_testToken.approve(env.eth.l1ERC20Gateway.address, 10_000)).to.not.be.reverted;
	
		// setup fuel client and setup l2 side contract for ERC20
		const bytecode = readFileSync(join(__dirname, '../bridge-fungible-token/bridge_fungible_token.bin'));
		const factory = new ContractFactory(bytecode, FuelFungibleTokenContractABI_json, env.fuel.deployer);
		fuel_testToken = await factory.deployContract();
		fuel_testTokenId = fuel_testToken.id.toHexString();
	});

	describe('Bridge ERC20 to Fuel', async () => {
		const NUM_TOKENS = 100;
		let ethereumETHSender: Signer;
		let ethereumETHSenderAddress: string;
		let ethereumETHSenderBalance: BigNumber;
		let fuelETHReceiver: AbstractAddress;
		let fuelETHReceiverAddress: string;
		let fuelETHReceiverBalance: BN;
		let fuelETHMessageNonce: BN;
		let fuelETHMessageReceiver: AbstractAddress;
		before(async () => {
			ethereumETHSender = env.eth.signers[0];
			ethereumETHSenderAddress = await ethereumETHSender.getAddress();
			ethereumETHSenderBalance = await eth_testToken.balanceOf(ethereumETHSenderAddress);
			fuelETHReceiver = env.fuel.signers[0].address;
			fuelETHReceiverAddress = fuelETHReceiver.toHexString();
			fuelETHReceiverBalance = await env.fuel.provider.getBalance(fuelETHReceiver, fuel_testTokenId);
		});

		it('Bridge ERC20 via L1ERC20Gateway', async () => {
			// approve l1 side gateway to spend the tokens
			await expect(eth_testToken.connect(ethereumETHSender).approve(env.eth.l1ERC20Gateway.address, NUM_TOKENS)).to.not.be.reverted;

			// use the L1ERC20Gateway to deposit test tokens and receive equivalent tokens on Fuel
			let tx = await env.eth.l1ERC20Gateway.connect(ethereumETHSender).deposit(fuelETHReceiverAddress, eth_testToken.address, fuel_testTokenId, NUM_TOKENS);
			let result = await tx.wait();
			expect(result.status).to.equal(1);

			// parse events from logs
			let event = env.eth.fuelMessagePortal.interface.parseLog(result.logs[2]);
			fuelETHMessageNonce = new BN(event.args.nonce.toHexString());
			fuelETHMessageReceiver = Address.fromB256(event.args.recipient);

			// check that the sender balance has decreased by the expected amount
			let newSenderBalance = await eth_testToken.balanceOf(ethereumETHSenderAddress);
			expect(newSenderBalance.eq(ethereumETHSenderBalance.sub(NUM_TOKENS))).to.be.true;
		});

		it('Relay Message from Ethereum on Fuel', async function() {
			// override the default test timeout from 2000ms
			this.timeout(FUEL_MESSAGE_TIMEOUT_MS);

			// wait for message to appear in fuel client and be executed automatically
			expect(await fuels_waitForMessage(env.fuel.provider, fuelETHMessageReceiver, fuelETHMessageNonce, FUEL_MESSAGE_TIMEOUT_MS, true)).to.equal(true);
		});

		it('Check ERC20 arrived on Fuel', async () => {
			// check that the recipient balance has increased by the expected amount
			let newReceiverBalance = await env.fuel.provider.getBalance(fuelETHReceiver, fuel_testTokenId);
			console.log(fuelETHReceiverBalance)
			console.log(newReceiverBalance)
			expect(newReceiverBalance.eq(fuelETHReceiverBalance.add(NUM_TOKENS))).to.be.true;
		});
	});

	describe('Bridge ERC20 from Fuel', async () => {
		it('Bridge ERC20 via Fuel token contract', async () => {
			//TODO
		});

		it('Relay Message from Fuel on Ethereum', async () => {
			//TODO
		});

		it('Check ERC20 arrived on Ethereum', async () => {
			//TODO
		});
	});
});
