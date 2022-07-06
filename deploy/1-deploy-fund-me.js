const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
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

    await deploy("FundMe", {
        from: deployer,
        gasLimit: 4000000,
        args: [ethUsdPriceFeedAddress],
        log: true,
    });

    log("Fund me deployed!");
    log("----------------------");
};

module.exports.tags = ["all", "fundme"];
