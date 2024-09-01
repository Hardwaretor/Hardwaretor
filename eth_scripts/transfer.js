

async function main() {
    console.log('Getting the fun token contract...');
    const contractAddress = '0x42769B0CE68A665e47c1a5776B08F1AB6B4F8e58';
    const HAW = await ethers.getContractAt('HAW', contractAddress);
    console.log(contractAddress);
    console.log(HAW);

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
    let ownerBalance = await HAW.balanceOf(ownerAddress);
    console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ownerBalance}\n`);

    console.log('Initiating a transfer...');
    const recipientAddress = '0x62C9Cfc659d547d83313bB69A89bA3A53e53f82c';
    const transferAmount = 1000000000000000000;
    console.log(`Transferring ${transferAmount} ${symbol} tokens to ${recipientAddress} from ${ownerAddress}`);
    await HAW.transfer(recipientAddress, transferAmount.toString());
    console.log('Transfer completed');
    ownerBalance = await HAW.balanceOf(ownerAddress);
    console.log(`Balance of owner (${ownerAddress}): ${ownerBalance} ${symbol}`);
    let recipientBalance = await HAW.balanceOf(recipientAddress);
    console.log(`Balance of recipient (${recipientAddress}): ${recipientBalance} ${symbol}\n`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });