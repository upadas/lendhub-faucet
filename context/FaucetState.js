import React, { useState } from "react";
import FaucetContext from "./faucetContext";
import { ethers } from "ethers";
// const {
//   DAI_USD_ADDRESS,
//   USDC_USD_ADDRESS,
//   LINK_USD_ADDRESS,
// } = require("../addresses");

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

  // const connectWallet = async () => {
  //   console.log("Connecting to MetaMask wallet...");

  //   // First, check if Metamask is installed
  //   if (typeof window.ethereum !== "undefined") {
  //     console.log("Metamask is installed!");
  //     try {
  //       const accounts = await ethereum.request({
  //         method: "eth_requestAccounts",
  //       });

  //       window.ethereum.on("chainChanged", () => {
  //         window.location.reload();
  //       });

  //       window.ethereum.on("accountsChanged", () => {
  //         window.location.reload();
  //       });
  //     } catch (error) {
  //       reportError(error);
  //     }
  //   } else {
  //     alert("MetaMask is not installed, please install and try again");
  //     console.log("MetaMask is not installed, please install and try again");
  //     return;
  //   }

  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const network = await provider.getNetwork();
  //     const networkName = network.name;
  //     const signer = provider.getSigner();

  //     // if (networkName != "sepolia") {
  //     //   alert("Please switch your network to Sepolia Testnet");
  //     //   return;
  //     // }

  //     if (accounts.length) {
  //       let currentAddress = accounts[0];
  //       setMetamaskDetails({
  //         provider: provider,
  //         networkName: networkName,
  //         signer: signer,
  //         currentAccount: currentAddress,
  //       });
  //       console.log("Connected to wallet....");
  //     } else {
  //       alert(
  //         "Could not retrieve accounts from the wallet, Please create accounts an retry"
  //       );
  //       console.log("Could not retrieve accounts from the wallet");
  //       return;
  //     }
  //   } catch (error) {
  //     reportError(error);
  //   }
  // };

  const connectWallet = async () => {
    console.log("1. Connecting to wallet...");
    const { ethereum } = window;
    const failMessage = "Please install Metamask & connect your Metamask";
    try {
      if (!ethereum) return; // console.log(failMessage);
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
        displayYourTransactions();
      } else {
        alert(failMessage);
        return;
      }
    } catch (error) {
      reportError(error);
    }
  };

  /*************************** SendMe Functionality ***************************/
  const transferAssets = async (userAddress, tokenAddress) => {
    try {
      // const amount = numberToEthers(borrowAmount);
      // console.log(
      //   "***Transferring token : " + token + "| borrowAmount : " + borrowAmount
      // );

      // const contract = await getContract(LendingPoolAddress, LendingPoolABI);
      // const transaction = await contract
      //   .connect(metamaskDetails.signer)
      //   .borrow(token, amount);
      // await transaction.wait();

      console.log("Token Transfer...");
      displayYourTransactions();
      return { status: 200, message: "Transaction Successful.." };
    } catch (error) {
      reportError(error);
      return { status: 500, message: error.reason };
    }
  };

  const displayYourTransactions = () => {
    try {
      const hash =
        "0x101f3c743d8e7071228c849b22cf082b31c37184e0bacc0a3fbf54e4929651b9";
      setYourTransaction({
        transactionHash: hash,
        transactionUrl: "https://sepolia.etherscan.io/tx/" + hash,
        timePassed: "8 hours ago",
      });
    } catch (error) {
      reportError(error);
      return { status: 500, message: error.reason };
    }
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
