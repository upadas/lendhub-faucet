import React, { useState } from "react";
import FaucetContext from "./FaucetContext";
import { ethers } from "ethers";
import Axios from "axios";

const { ETHAddress, FaucetAddress } = require("../addresses");
const http = require("http");
const FaucetAbi = require("../abis/Faucet.json");

const FaucetState = (props) => {
  // Set metamask details
  const [metamaskDetails, setMetamaskDetails] = useState({
    provider: null,
    networkName: null,
    signer: null,
    currentAccount: null,
  });

  const [yourTransaction, setYourTransaction] = useState({
    transactionHash: null,
    transactionUrl: null,
    timePassed: null,
  });

  const connectWallet = async () => {
    console.log("1. Connecting to wallet...");
    const { ethereum } = window;
    const failMessage = "Please install Metamask & connect your Metamask";
    try {
      if (!ethereum) return;
      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const networkName = network.name;
      const signer = provider.getSigner();

      if (networkName != "sepolia") {
        alert("Please switch your network to Sepolia Testnet");
        return;
      }

      if (account.length) {
        let currentAddress = account[0];
        setMetamaskDetails({
          provider: provider,
          networkName: networkName,
          signer: signer,
          currentAccount: currentAddress,
        });
        console.log("Connected to wallet....");
      } else {
        alert(failMessage);
        return;
      }
    } catch (error) {
      reportError(error);
    }
  };

  /*************************** SendMe Functionality ***************************/
  async function getClientIPAddress() {
    const response = await Axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  }

  const isETHTransferred = (address) => {
    if (address === ETHAddress) {
      return true;
    }
    return false;
  };

  const transferAssets = async (userAddress, tokenAddress) => {
    // const clientIPAddress = await getClientIPAddress();

    const clientIPAddress = "45.107.199.226";
    try {
      console.log(`Transfer Asset request - 
      client address: ${userAddress} | 
      client IP: ${clientIPAddress}  |  
      token: ${tokenAddress}`);

      let contract;
      try {
        contract = new ethers.Contract(
          FaucetAddress,
          FaucetAbi.abi,
          metamaskDetails.provider
        );
      } catch (error) {
        reportError;
        console.log("Error: " + error);
      }

      let transaction;
      if (isETHTransferred(tokenAddress)) {
        transaction = await contract
          .connect(metamaskDetails.signer)
          .transferETH(clientIPAddress);
        console.log("Asset transfer in progress...");
        await transaction.wait();
      } else {
        transaction = await contract
          .connect(metamaskDetails.signer)
          .transferToken(tokenAddress, clientIPAddress);
        console.log("Asset transfer in progress...");
        await transaction.wait();
      }

      console.log("Asset transfered...");
      console.log("transaction :" + JSON.stringify(transaction));
      console.log("Asset Transfer complete...");

      console.log("Transaction hash : " + transaction.hash);
      displayYourTransactions(transaction.hash);
      return { status: 200, message: "Transaction Successful.." };
    } catch (error) {
      reportError(error);
      return { status: 500, message: error.reason };
    }
  };

  // const timePassed = () => {
  //   get
  // };

  const displayYourTransactions = (txHash) => {
    // const hash =
    //   "0x101f3c743d8e7071228c849b22cf082b31c37184e0bacc0a3fbf54e4929651b9";
    setYourTransaction({
      transactionHash: txHash,
      transactionUrl: "https://sepolia.etherscan.io/tx/" + txHash,
      timePassed: "8 hours ago",
    });
  };

  const reportError = (error) => {
    console.error(JSON.stringify(error));
  };

  return (
    <FaucetContext.Provider
      value={{
        metamaskDetails,
        connectWallet,
        transferAssets,
        yourTransaction,
      }}
    >
      {props.children}
    </FaucetContext.Provider>
  );
};

export default FaucetState;
