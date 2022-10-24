import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'ethers';
import { AbstractAddress, BN } from 'fuels';
import { TestEnvironment, setupEnvironment } from '../scripts/setup';
import { fuels_parseEther, fuels_waitForMessage } from '../scripts/utils';

chai.use(solidity);
const { expect } = chai;

describe('Transferring ETH', async () => {
	const ETH_ASSET_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";
	const FUEL_MESSAGE_TIMEOUT_MS: number = 10_000;
	let env: TestEnvironment;

	before(async () => {
		env = await setupEnvironment({});
	});

	describe('Send ETH to Fuel', async () => {
		let fuelETHReceiver: AbstractAddress;
		let fuelETHReceiverBalance: BN;
		let fuelETHMessageNonce: BN;
		before(async () => {
			fuelETHReceiver = env.fuel.signers[0].address;
			fuelETHReceiverBalance = await env.fuel.provider.getBalance(fuelETHReceiver, ETH_ASSET_ID);
		});

		it('Send ETH via MessagePortal', async () => {
			// use the FuelMessagePortal to directly send ETH which should be immediately spendable
			let tx = await env.eth.fuelMessagePortal.sendETH(fuelETHReceiver.toHexString(), {
				value: ethers.utils.parseEther("0.1")
			});
			let result = await tx.wait();
			expect(result.status).to.equal(1);

			// parse events from logs
			let event = env.eth.fuelMessagePortal.interface.parseLog(result.logs[0]);
			fuelETHMessageNonce = new BN(event.args.nonce.toHexString());
		});

		it('Wait for ETH to arrive on Fuel', async function() {
			// override the default test timeout from 2000ms
			this.timeout(FUEL_MESSAGE_TIMEOUT_MS);

			// wait for message to appear in fuel client
			expect(await fuels_waitForMessage(env.fuel.provider, fuelETHReceiver, fuelETHMessageNonce)).to.equal(true);

			// check that the recipient balance has increased by the expected amount
			let newReceiverBalance = await env.fuel.provider.getBalance(fuelETHReceiver, ETH_ASSET_ID);
			expect(newReceiverBalance.eq(fuelETHReceiverBalance.add(fuels_parseEther("0.1")))).to.be.true;
		});
	});

	describe('Send ETH from Fuel', async () => {
		it('Send ETH via OutputMessage', async () => {
			//TODO
			//fuels_parseEther("0.1")
			//env.fuel.deployer.transfer();
		});

		it('Relay Message from Fuel on Ethereum', async () => {
			//TODO
		});

		it('Check ETH arrived on Ethereum', async () => {
			//TODO
		});
	});
});
