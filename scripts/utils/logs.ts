import { formatEther } from 'ethers/lib/utils';
import { fuels_formatEther } from './parsers';
import { Signer } from 'ethers';
import { WalletUnlocked } from 'fuels';

export async function logBalances(ethereumAccount: Signer, fuelAccount: WalletUnlocked) {
  const etherAccountAddress = await ethereumAccount.getAddress();
  const fuelAccountAddress = await fuelAccount.address.toHexString();
  console.log('Account balances:');
  console.log(`  Ethereum - ${formatEther(await ethereumAccount.getBalance())} ETH (${etherAccountAddress})`);
  console.log(`  Fuel - ${fuels_formatEther(await fuelAccount.getBalance())} ETH (${fuelAccountAddress})`);
  console.log('');
}
