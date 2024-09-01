
async function main() {

  console.log('Getting the HAW token contract...');
  const contractAddress = '0xe8650c4F704661561DBD34e91986da805CeEB1E4';
  const HAW = await ethers.getContractAt('HAW', contractAddress);
  console.log(contractAddress);
  console.log('Querying token name...');
  const name = await HAW.name();
  console.log(`Token Name: ${name}\n`);
  console.log('Querying token symbol...');
  const symbol = await HAW.symbol();
  console.log(`Token Symbol: ${symbol}\n`);
  console.log('Querying token supply...');
  const totalSupply = await HAW.totalSupply();
  console.log(`Total Supply including all decimals: ${totalSupply}`);
  console.log('Getting the balance of contract owner...');
  const signers = await ethers.getSigners();
  const ownerAddress = signers[0].address;
  const ownerBalance = await HAW.balanceOf(ownerAddress);
  console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ownerBalance}\n`);
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const weiAmount = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", (weiAmount));
  const mintAmount = "50000000000000000000"; 
  const mintTx = await HAW.mint(ownerAddress, mintAmount);
  await mintTx.wait();
  console.log("Successfully minted 50 tokens.");
  console.log(`Updated balance of contract owner: ${ownerBalance}`);
}

// run main, catch error, if any, and log in console
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
