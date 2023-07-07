import { ContractFactory, TxParams } from 'fuels';
import { join } from 'path';
import { readFileSync } from 'fs';
import { TestEnvironment } from '../../setup';
import { Token } from '../../../fuel-v2-contracts/Token.d';
import { Contract, hexlify } from 'fuels';

import FuelFungibleTokenContractABI_json from '../../../bridge-fungible-token/bridge_fungible_token-abi.json';
const FuelBytecodeToken = readFileSync(join(__dirname, '../../../bridge-fungible-token/bridge_fungible_token.bin'));

const { FUEL_FUNGIBLE_TOKEN_ADDRESS } = process.env;

export async function getOrDeployFuelTokenContract(env: TestEnvironment, ethTestToken: Token, fuelTxParams: TxParams) {
  const tokenGetWay = env.eth.fuelERC20Gateway.address.replace('0x', '');
  const tokenAddress = ethTestToken.address.replace('0x', '');
  const fuelAcct = env.fuel.signers[1];

  let fuelTestToken: Contract = null;
  if (FUEL_FUNGIBLE_TOKEN_ADDRESS) {
    try {
      fuelTestToken = new Contract(FUEL_FUNGIBLE_TOKEN_ADDRESS, FuelFungibleTokenContractABI_json, fuelAcct);
      await fuelTestToken.functions.name().dryRun();
    } catch (e) {
      fuelTestToken = null;
      console.log(
        `The Fuel fungible token contract could not be found at the provided address ${FUEL_FUNGIBLE_TOKEN_ADDRESS}.`
      );
    }
  }
  if (!fuelTestToken) {
    console.log(`Creating Fuel fungible token contract to test with...`);
    let bytecodeHex = hexlify(FuelBytecodeToken);
    console.log('Replace ECR20 contract id');
    // TODO: change this to use Contract Configurables
    bytecodeHex = bytecodeHex.replace('96c53cd98b7297564716a8f2e1de2c83928af2fe', tokenGetWay);
    bytecodeHex = bytecodeHex.replace('00000000000000000000000000000000deadbeef', tokenAddress);
    console.log('Deploy contract on Fuel');
    const factory = new ContractFactory(bytecodeHex, FuelFungibleTokenContractABI_json, env.fuel.deployer);
    fuelTestToken = await factory.deployContract({
      ...fuelTxParams,
      storageSlots: [],
    });
    console.log(`Fuel fungible token contract created at ${fuelTestToken.id.toHexString()}.`);
  }
  fuelTestToken.account = fuelAcct;
  const fuelTestTokenId = fuelTestToken.id.toHexString();
  console.log(`Testing with Fuel fungible token contract at ${fuelTestTokenId}.`);

  return fuelTestToken;
}
