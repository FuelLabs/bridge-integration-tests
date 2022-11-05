import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers, BigNumber, Signer } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { AbstractAddress, Address, BN, WalletUnlocked as FuelWallet } from 'fuels';
import { TestEnvironment, setupEnvironment } from '../scripts/setup';
import { fuels_parseEther, fuels_waitForMessage } from '../scripts/utils';

chai.use(solidity);
const { expect } = chai;

describe('Transferring ETH', async () => {
	/*
	const ETH_ASSET_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";
	const FUEL_MESSAGE_TIMEOUT_MS: number = 10_000;
	let env: TestEnvironment;

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
			await fuelETHSender.withdrawToBaseLayer(Address.fromString(ethereumETHReceiverAddress), fuels_parseEther(NUM_ETH));
			//console.log(fuelETHSenderAddress)
			//console.log(fuelETHSenderBalance.toString())
			//try {
			//	let r = await fuels_wallet_withdraw(fuelETHSender, Address.fromString(ethereumETHReceiverAddress), fuels_parseEther(NUM_ETH));
			//	console.log(r)
			//} catch(e) {}
			//console.log((await fuelETHSender.getBalance(ETH_ASSET_ID)).toString())
		});

		it('Relay Message from Fuel on Ethereum', async () => {
			//TODO
		});

		it('Check ETH arrived on Ethereum', async () => {
			//TODO
		});
	});
	*/
});
