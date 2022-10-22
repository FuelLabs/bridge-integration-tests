import { DeployFunction } from "hardhat-deploy/dist/types";

const deployFn: DeployFunction = async (hre) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const deployerSigner = await hre.ethers.getSigner(deployer);
  const poaSigner = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc';

  // Deploy libraries
  let binaryMerkleTreeLib = await deploy("BinaryMerkleTreeLib", {
    contract: "BinaryMerkleTree",
    from: deployer,
    args: [],
    log: true,
  });

  // Deploy consensus contracts
  let fuelSidechainConsensus = await deploy("FuelSidechainConsensus", {
    contract: "FuelSidechainConsensus",
    from: deployer,
    args: [poaSigner],
    log: true,
  });

  // Deploy messaging contracts
  let fuelMessagePortal = await deploy("FuelMessagePortal", {
    contract: "FuelMessagePortal",
    from: deployer,
    args: [fuelSidechainConsensus.address],
    libraries: {
      BinaryMerkleTree: binaryMerkleTreeLib.address,
    },
    log: true,
  });

  // Deploy contract for ERC20 bridging
  let l1ERC20Gateway = await deploy("L1ERC20Gateway", {
    contract: "L1ERC20Gateway",
    from: deployer,
    args: [
      fuelMessagePortal.address,
    ],
    log: true,
  });
};

// This is kept during an upgrade. So no upgrade tag.
deployFn.tags = ["L1_Contracts"];

export default deployFn;
