const { network } = require("hardhat");
const { DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network! Deploying mocks....");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            gasLimit: 4000000,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });
        log("Mocks deployed!");
        log("----------------------");
    }
};

module.exports.tags = ["all", "mocks"];
