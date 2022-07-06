require("dotenv").config();
const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    var ethUsdPriceFeedAddress;
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [ethUsdPriceFeedAddress];

    var deploymentResult = await deploy("FundMe", {
        from: deployer,
        gasLimit: 4000000,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    console.log(deploymentResult);
    //only verifies on testnets
    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        log("Verifing contract on Etherscan!");
        log("----------------------");
        await verify(deploymentResult.address, args);
        log("--------Verify Done--------------");
    }

    log("Fund me deployed!");
    log("----------------------");
};

module.exports.tags = ["all", "fundme"];
