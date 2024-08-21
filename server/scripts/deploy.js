const hre = require("hardhat");

async function main() {
  // Correctly specify the contract name
  const ContractApi = await hre.ethers.getContractFactory("ContractApi");
  const contractApi = await ContractApi.deploy();

  await contractApi.deployed();

  console.log(`Contract deployed to address: ${contractApi.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
