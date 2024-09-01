
async function main() {

  const NFTFactory = await ethers.getContractAt('NFTFactory', '0x1fe8bbB9B1CE8b152Dd677135442e5c79b0A23d1');
  const NFT = await ethers.getContractAt('NFT', '0xfbA64BA94bA7A3D2fC88e3ebB7Dc71f12e65ADdE');
  const mintTx = await NFTFactory.createNFT("0x62C9Cfc659d547d83313bB69A89bA3A53e53f82c", "https://hardwaretor.com/public/icon.png");
  await mintTx.wait();
  const mintTx2 = await NFT.safeMint("0x62C9Cfc659d547d83313bB69A89bA3A53e53f82c", "https://hardwaretor.com/public/icon.png");
  await mintTx2.wait();

}

// run main, catch error, if any, and log in console
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
