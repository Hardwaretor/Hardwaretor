// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IToken {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract HardwaretorBatchMinter {
    IToken public token;
    
    // Dirección predeterminada del contrato de token (modificar según sea necesario)
    address private constant DEFAULT_TOKEN_ADDRESS = 0x63eC86fC38A0021FCF4980ADA380FF82c7859788;

    // Constructor que usa la dirección predeterminada
    constructor() {
        token = IToken(DEFAULT_TOKEN_ADDRESS);
    }

    // Función para hacer un airdrop en batch
    function batchAirdrop(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "Mismatched arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transfer(recipients[i], amounts[i]), "Transfer failed");
        }
    }

    // Función para actualizar la dirección del token (opcional)
    function updateTokenAddress(address newTokenAddress) external {
        // Aquí podrías agregar algún tipo de control de acceso para permitir solo al propietario actualizar la dirección
        token = IToken(newTokenAddress);
    }
}


