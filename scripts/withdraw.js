const { getNamedAccounts, ethers } = require('hardhat')

async function main(){
    const accounts = await getNamedAccounts()
    const deployer = accounts.deployer

    const fundMe = await ethers.getContractAt("FundMe", deployer)
    console.log("Withdrawing....")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Withdraw successfull!")
}

main()
    .then(() => process.exit(1))
    .catch((e)=>{
        console.log(e)
        process.exit(1)
    })