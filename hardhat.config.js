require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
require("chai")

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "850c0c750f16fcecefeabc68fdcb5845e8e0cac35e674e014fdf63368bcf6e6f"
const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL ||
    "https://eth-goerli.g.alchemy.com/v2/SqFx8dp_yA2R-Y-OXs9tXdPt0K8_bPS7"
const ETHERSCAN_API_KEY =
    process.env.ETHERSCAN_API_KEY || "MXXDSD8RWMYXJ3GUDMPEDPYM9MIJ1BIMXC"
const COINMARKETCAP_KEY = process.env.COINMARKETCAP_API_KEY || "key"

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        // outputFile: "gas-report.txt",
        currency: "USD",
        noCOlors: false,
        // gasPrice: 90,
        token: "ETH",
        coinmarketcap: COINMARKETCAP_KEY,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer.
            //Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
