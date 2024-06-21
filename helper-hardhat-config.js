const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: process.env.SEPOLIA_PRICEFEED_ADDRESS
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}