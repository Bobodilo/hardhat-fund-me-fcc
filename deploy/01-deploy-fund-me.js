//import
//not gonna have main function
// calling of main function
// calling of main fucntion no either

const { networkConfig, developmentChains } = require("../helper-hardhat-config") //import the the chains id here
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

//the main deploy function
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // or const { deployments, getNamedAccounts, network } = require("hardhat")

    // function deployFunc() {
    //     console.log("hi")
    // }
    // module.experts.default = deployFunc
    // module.experts = async (hre) => {
    //     const {getNamedAccounts, deployments} = hre
    // }

    //If chainId is X use address Y, if Z use A
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //if the contract doesn't exist then we deploy a minimal version for our testing

    //well what happens when we wanna change chains?
    // when going for localhost or hardhat network we to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put price feed Address,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("--------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
