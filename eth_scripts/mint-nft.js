const fs = require("fs");

const galleryPath = "./galleryNFT.json";

async function main() {
  
  let gallery = [];
  if (fs.existsSync(galleryPath)) {
    const galleryData = fs.readFileSync(galleryPath, "utf8");
    gallery = JSON.parse(galleryData);
  }

  const contractAddress = '0xF7BEce35f6ae10343F859Bc0196EE418f6300168';
  const NFT = await ethers.getContractAt('NFT', contractAddress);
  const signers = await ethers.getSigners();
  const ownerAddress = signers[0].address;

  for (const model of gallery) {

    const tokenURI = model.tokenURI
    const mintTx = await NFT.safeMint(ownerAddress,tokenURI);
    await mintTx.wait();

  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
