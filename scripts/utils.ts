/// @dev The Fuel testing utils.
/// A set of useful helper methods for the integration test environment.
import { ethers, BigNumber } from 'ethers';
import { Provider as FuelProvider, BN, AbstractAddress, BigNumberish, TransactionRequestLike, TransactionResponse, MAX_GAS_PER_TX, ScriptTransactionRequest, CoinQuantityLike, AbstractWallet, Wallet, OutputType, TransactionRequestOutput } from 'fuels';

// Constants
const ETHEREUM_ETH_DECIMALS: number = 18;
const FUEL_ETH_DECIMALS: number = 9;
const FUEL_MESSAGE_POLL_MS: number = 300;

// Parse ETH value as a string
export function fuels_parseEther(ether: string): BN {
	let val = ethers.utils.parseEther(ether);
	val = val.div(10 ** (ETHEREUM_ETH_DECIMALS - FUEL_ETH_DECIMALS));
	return new BN(val.toHexString());
}

// Format ETH value to a string
export function fuels_formatEther(ether: BN): string {
	let val = BigNumber.from(ether.toHex());
	val = val.mul(10 ** (ETHEREUM_ETH_DECIMALS - FUEL_ETH_DECIMALS));
	return ethers.utils.formatEther(val);
}

// Wait until a message is present in the fuel client
export async function fuels_waitForMessage(provider: FuelProvider, recipient: AbstractAddress, nonce: BN, timeout: number, waitForExecution: boolean = false): Promise<boolean> {
	let startTime = (new Date()).getTime();
	while ((new Date()).getTime() - startTime < timeout) {
		let messages = await provider.getMessages(recipient, { first: 1000 });
		for (let message of messages) {
			if (message.nonce.eq(nonce)) {
				//TODO: need to check fuel spent state rather than assume message execution within a time limit
				if(waitForExecution) await delay(3000);
				return true;
			}
		}
		await delay(FUEL_MESSAGE_POLL_MS);
	}
	return false;
}

// Simple async delay function
function delay(ms: number) {
	return new Promise( resolve => setTimeout(resolve, ms) );
}
