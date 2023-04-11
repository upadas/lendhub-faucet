const { ethers } = require("hardhat");
const { MAIN_ACCOUNT, INFURA_API_KEY, INFURA_SEPOLIA_API_URL } = process.env;
const axios = require("axios");
const {
  DAI_USD_ADDRESS,
  USDC_USD_ADDRESS,
  LINK_USD_ADDRESS,
} = require("../addresses");
const dai = require("../abis/dai.json");
const usdc = require("../abis/usdc.json");
const link = require("../abis/link.json");

const numberToEthers = (number) => {
  return ethers.utils.parseEther(number.toString());
};

const amount = 100000;
const faucetInitialTokenAmount = 10000;

const infuraProvider = new ethers.providers.InfuraProvider(
  "sepolia",
  INFURA_API_KEY
);
const wallet = new ethers.Wallet(MAIN_ACCOUNT, infuraProvider);
console.log("Signer Address: " + wallet.address);

const transferToken = async (tokenAddress, tokenAbi, faucetAddress) => {
  let token = new ethers.Contract(tokenAddress, tokenAbi, infuraProvider);

  console.log(
    "Transferring" +
      JSON.stringify(token.address) +
      `to the smart contract ${faucetAddress}`
  );
  const preBalance = await token.balanceOf(faucetAddress);
  console.log("Balance Before Xfer: " + preBalance);

  await token
    .connect(wallet)
    .transfer(faucetAddress, numberToEthers(faucetInitialTokenAmount));

  const postBalance = await token.balanceOf(faucetAddress);
  console.log("Balance After Xfer: " + postBalance);
};

// Increase the nonce to create a new transaction, if not you will see error below
// reason: 'replacement fee too low', code: 'REPLACEMENT_UNDERPRICED',
async function getNonce(address) {
  const response = await axios.post(INFURA_SEPOLIA_API_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getTransactionCount", //gets the nonce
    params: [address, "latest"],
  });
  return response.data.result;
}

const isNonceNew = async (nonce) => {
  // const nonce = await getNonce(wallet.address);
  console.log("pre nonce: " + nonce);
  // await sleep(30000);
  const newNonce = await getNonce(wallet.address);
  console.log("post nonce: " + newNonce);
  if (nonce < newNonce) {
    return true;
  }
  return false;
};

const waitUntilNewNonce = async (nonce) => {
  while (!(await isNonceNew(nonce))) {
    await sleep(30000);
  }
};

const sleep = (ms) => {
  console.log(`sleeping for ${ms}`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

tokenInfo = [
  { token: DAI_USD_ADDRESS, abi: dai.abi },
  { token: USDC_USD_ADDRESS, abi: usdc.abi },
  { token: LINK_USD_ADDRESS, abi: link.abi },
];

/*************** transfer tokens ****************/

/*************** main ****************/
async function main() {
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy();
  await faucet.deployed();
  console.log("Faucet address :" + faucet.address);

  for (const { token, abi } of tokenInfo) {
    const nonce = await getNonce(wallet.address);
    await transferToken(token, abi, faucet.address);
    await waitUntilNewNonce(nonce);
  }
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

//------------------------------------------------

// npx hardhat run scripts/deploy.js --network sepolia
// npx hardhat verify --network sepolia 0x002700E4A113B14EE1E91d0EFC5561F91c28359f

// npx hardhat verify --network sepolia 0xFFd06BC984c7a9284A96caD68EBc318688f9bdCA
