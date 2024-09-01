
const fs = require('fs');
const xlsx = require('xlsx');

async function main() {

  console.log('Getting the HAW token contract...');
  const contractAddress = '0x63eC86fC38A0021FCF4980ADA380FF82c7859788';
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

  // Load Excel file
  const workbook = xlsx.readFile('accounts.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (let row of data) {
    const accountAddress = row['Account Address'];
    const mintAmount = row['Token Amount'];
    const mintTx = await HAW.mint(accountAddress, mintAmount);
    await mintTx.wait();
    console.log(`Successfully minted ${mintAmount} tokens to ${accountAddress}`);
  }

  console.log(`Updated balance of contract owner (${deployer.address}): ${ownerBalance}`);
}

main()
