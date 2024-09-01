
async function main() {

  console.log('Getting the HAW token contract...');
  const contractAddress = '0x4996af61353444cB1b57813dAeA1183Ab4bCC381';
  const NFT = await ethers.getContractAt('NFT', contractAddress);
  console.log(contractAddress);
  console.log('Querying token name...');
  const name = await NFT.name();
  console.log(`Token Name: ${name}\n`);
  console.log('Querying token symbol...');
  const symbol = await NFT.symbol();
  console.log(`Token Symbol: ${symbol}\n`);
  console.log('Querying token supply...');
  const totalSupply = await NFT.totalSupply();
  console.log(`Total Supply including all decimals: ${totalSupply}`);
  console.log('Getting the balance of contract owner...');
  const signers = await ethers.getSigners();
  const ownerAddress = signers[0].address;
  const ownerBalance = await NFT.balanceOf(ownerAddress);
  console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ownerBalance}\n`);
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const weiAmount = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", (weiAmount));
  const mintTx = await NFT.safeMint(ownerAddress);
  await mintTx.wait();
  console.log("Successfully minted 1 NFT.");
  console.log(`Updated balance of contract owner: ${ownerBalance}`);
}

// run main, catch error, if any, and log in console
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
