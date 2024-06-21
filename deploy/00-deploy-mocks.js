const { network } = require('hardhat')
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if(developmentChains.includes(network.name)){
        log("Local network detected, deploying mocks...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })

        log("Mocks deployed")
        log("-----------------------------------")
    } else {
        log("Not deploying mocks as network is not local");
    }
}

module.exports.tags = ["all", "mocks"]