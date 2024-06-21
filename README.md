# FundMe Crowdfunding Smart Contract

## Overview
The 'FundMe' smart contract is a crowdfunding contract built on Ethereum. It allows users to contribute ETH to the contract and the owner can withdraw the funds once the campaign ends. The contract also uses a price feed to ensure a minimum contribution amount in USD.

## Features
- Crowdfunding: Users can fund the contract by sending ETH.
- Minimum Contribution: Enforces a minimum contribution amount in USD.
- Ownership: Only the owner of the contract can withdraw the funds.
- Price Feed Integration: Uses Chainlink price feed to convert ETH to USD.

## Prerequisites
- Node.js
- Hardhat
- Etherjs
- Chainlink
- dotenv

## Installation
1. Clone the repository
```
git clone https://github.com/ExtraCaterpiller/FundMe
cd FundMe
```
2. Install dependencies:
```
npm install
```
3. Create a .env file in the root directory:
```
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Deploy the contract:
```
npx hardhat deploy
```

## License
This project is licensed under the MIT License.
