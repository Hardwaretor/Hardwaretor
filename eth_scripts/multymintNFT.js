const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Leer el archivo galleryNFT.json
    const galleryPath = path.join(__dirname, 'galleryNFT.json');
    const gallery = JSON.parse(fs.readFileSync(galleryPath, 'utf8'));

    // Desplegar el contrato NFTFactory
    const NFT = await ethers.getContractFactory("NFT");
    const factory = await NFT.deploy();

    // Desplegar un contrato NFT para cada elemento en el galleryNFT.json
    for (const item of gallery) {
        const tx = await factory.deployNFTContract(item.name, item.name, deployer.address);
        const receipt = await tx.wait();

        // Obtener la dirección del nuevo contrato NFT
        const event = receipt.events.find(event => event.event === 'NFTContractDeployed');
        const [nftAddress] = event.args;
        console.log(`NFT contract for ${item.name} deployed to:`, nftAddress);

        // Actualizar la propiedad "contract" en galleryNFT.json
        item.contract = nftAddress;
    }

    // Guardar los cambios en galleryNFT.json
    fs.writeFileSync(galleryPath, JSON.stringify(gallery, null, 2));
    console.log("galleryNFT.json updated with contract addresses.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
