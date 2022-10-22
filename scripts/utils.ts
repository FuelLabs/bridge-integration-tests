/// @dev The Fuel testing utils.
/// A set of useful helper methods for the integration test environment.
import { ethers, BigNumber } from 'ethers';
import { BN } from 'fuels';

// Constants
const ETHEREUM_ETH_DECIMALS: number = 18;
const FUEL_ETH_DECIMALS: number = 9;

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
