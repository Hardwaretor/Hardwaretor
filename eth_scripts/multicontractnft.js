const fs = require("fs");
const { ethers, run } = require("hardhat");
const path = "./ignition/deployments/chain-11155111/deployed_addresses.json";
const galleryPath = "./galleryNFT.json";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const galleryData = JSON.parse(fs.readFileSync(galleryPath, "utf8"));
  const pathData = JSON.parse(fs.readFileSync(path, "utf8"));

  let deployedAddresses = {};

  if (fs.existsSync(path)) {
    deployedAddresses = JSON.parse(fs.readFileSync(path, "utf8"));
  }

  for (const nftData of galleryData) {

    console.log(`Deploying contract for: ${nftData.name}`);

    const NFT = await ethers.getContractFactory("NFT");
    const nftContract = await NFT.deploy();
    nftContract.deployTransaction;
    const contractAddress = nftContract.address;

    // Mint a new token
    try {

      // Pausar durante 10 segundos
      console.log(`Waiting for 60 seconds before minting ${nftData.name}...`);
      await delay(6000);

      console.log(`Attempting to mint NFT with image: ${nftData.image}`);
      const mintTx = await nftContract.safeMint(deployer.address, nftData.image);
      console.log("Mint transaction hash:", mintTx.hash);
      console.log("Mint transaction contract:", mintTx.to);
      await mintTx;

      // Guardar la dirección del contrato en el archivo JSON
      deployedAddresses[nftData.name] = mintTx.to;
      fs.writeFileSync(path, JSON.stringify(deployedAddresses, null, 2));
      console.log(`Address updated in ${path}`);


      nftData.contract = mintTx.to;
      console.log(`${nftData.name} deployed to:`, mintTx.to);
      fs.writeFileSync(path, JSON.stringify(deployedAddresses, null, 2));
      await nftData.contract;

      console.log(`Verifying contract for ${nftData.name}...`);

      // Pausar durante 10 segundos
      console.log(`Waiting for 60 seconds before verifying ${nftData.name}...`);
      await delay(6000);

      // Verificar el contrato
      try {
        console.log(`Verifying contract at: ${mintTx.to}`);
        await run("verify:verify", {
          address: mintTx.to,
          constructorArguments: [], // Agrega los argumentos del constructor si los hay
        });
        console.log(`Verified contract at: ${mintTx.to}`);
      } catch (verificationError) {
        console.error(`Verification failed for contract at: ${mintTx.to}`, verificationError);
      }

      console.log(`Verified contract for ${nftData.name} at ${mintTx.to}`);

    } catch (error) {
      console.error(`Error verifying contract for ${nftData.name}:`, error);
    }

  // Guardar la galería actualizada con las direcciones de los contratos
  fs.writeFileSync(galleryPath, JSON.stringify(galleryData, null, 2));
  fs.writeFileSync(path, JSON.stringify(deployedAddresses, null, 2));



  }



  // Función para crear una pausa asíncrona
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
