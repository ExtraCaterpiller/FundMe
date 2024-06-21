const { getNamedAccounts, ethers } = require('hardhat')

async function main(){
    const accounts = await getNamedAccounts()
    const deployer = accounts.deployer

    const fundMe = await ethers.getContractAt("FundMe", deployer)
    console.log("Funding Contract....")
    const transactionResponse = await fundMe.fund({value: ethers.parseUnits("1", "ether")})
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(1))
    .catch((e)=>{
        console.log(e)
        process.exit(1)
    })