const { ethers, getNamedAccounts, deployments, network } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const assert = require('assert')

developmentChains.includes(network.name)
    ? describe.skip 
    : describe("FundMe", async ()=>{
        let fundMe, deployer
        const sendValue = ethers.parseUnits(".05", "ether")

        beforeEach(async ()=>{
            const accounts = await getNamedAccounts()
            deployer = accounts.deployer

            const fundMeDeployment = await deployments.get("FundMe")
            fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        })

        it("Allows people to fund", async ()=>{
            await fundMe.fund({value: sendValue})
            await fundMe.withdraw()
            const endingBalance = await ethers.provider.getBalance(fundMe.target)

            assert.equal(endingBalance.toString(), "0")
        })
    })