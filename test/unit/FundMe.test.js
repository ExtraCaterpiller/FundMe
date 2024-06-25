const { deployments, getNamedAccounts, ethers, network } = require('hardhat')
const assert = require('assert')
const { expect } = require('chai')
const { developmentChains } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
    let fundMe, mockV3Aggregator, deployer
    const sendValue = ethers.parseUnits("1.0", "ether")

    beforeEach(async ()=> {
        const accounts = await getNamedAccounts()
        deployer = accounts.deployer

        // deploy all contracts
        await deployments.fixture(["all"])

        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)

        const mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator")
        mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", mockV3AggregatorDeployment.address)
    })

    describe("contructor", async () => {
        it("Sets the aggregator addresses correctly", async function(){
            const res = await fundMe.getPriceFeed()
            assert.equal(res, mockV3Aggregator.target)
        })
    })

    describe("fund", async ()=>{
        it("Fails if you don't send enough ETH", async () =>{
            await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough fund")
        })
        it("update the amount funded data structure", async ()=>{
            await fundMe.fund({value: sendValue})
            const response = await fundMe.getAddressToAmount(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async ()=>{
            await fundMe.fund({ value: sendValue })
            const res = await fundMe.getFunders(0)
            assert.equal(res.toString(), deployer)
        })
    })

    describe("withdraw", async ()=>{
        beforeEach(async ()=>{
            await fundMe.fund({ value: sendValue })
        })

        it("Withdraw ETH from a single founder", async ()=>{
            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const gasCost = transactionReceipt.gasUsed * transactionReceipt.gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)
            
            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())
        })

        it("Allows us to withdraw with multiple funders", async ()=>{
            const accounts = await ethers.getSigners()
            for(let i=1; i<6; i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const gasCost = transactionReceipt.gasUsed * transactionReceipt.gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)

            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())

            await expect(fundMe.getFunders(0)).to.be.reverted

            for(i=1; i<6; i++){
                assert.equal(await fundMe.getAddressToAmount(accounts[i].address), 0)
            }
        })

        it("Only allow owner to withdraw", async()=>{
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)

            await expect(attackerConnectedContract.withdraw()).to.be.reverted
        })

        it("Allows us to withdraw cheaper", async ()=>{
            const accounts = await ethers.getSigners()
            for(let i=1; i<6; i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const gasCost = transactionReceipt.gasUsed * transactionReceipt.gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)

            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())

            await expect(fundMe.getFunders(0)).to.be.reverted

            for(i=1; i<6; i++){
                assert.equal(await fundMe.getAddressToAmount(accounts[i].address), 0)
            }
        })
    })
})
