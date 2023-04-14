const { ethers } = require("hardhat");
const { except } = require("chai");

describe("Faucet", () => {
  before("Deploy contract", async () => {
    const Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    await faucet.deployed();
    console.log("Faucet address :" + faucet.address);
  });

  it("Should transfer 0.5 ETH to  each msg.sender", async () => {});
  it("Should not transfer 0.5 ETH to each subsequent request from the same msg.sender within the same 24 hour period", async () => {});
  it("Should not transfer 0.5 ETH to each subsequent request from the same IP address within the same 24 hour period", async () => {});
  it("Should transfer 0.5 ETH again to the same msg.sender after 24 hour elapsed", async () => {});

  it("Should transfer 10 DAI tokens to each msg.sender", async () => {});
  it("Should not transfer 10 tokens to each subsequent request from the same msg.sender within the same 24 hour period", async () => {});
  it("Should not transfer 10 tokens to each subsequent request from the same IP address within the same 24 hour period", async () => {});
  it("Should transfer 10 tokens again to the same msg.sender after 24 hour elapsed", async () => {});

  it("Only Faucet owner should be able to withdraw ETH", async () => {});
});
