import React, { useState } from "react";
import FaucetContext from "./FaucetContext";
import { ethers } from "ethers";
import Axios from "axios";

const { ETHAddress, FaucetAddress } = require("../addresses");
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
  // async function getClientIPAddress() {
  //   return new Promise((resolve, reject) => {
  //     http
  //       .get({ host: "api.ipify.org", port: 80, path: "/" }, function (resp) {
  //         let data = "";
  //         resp.on("data", function (chunk) {
  //           data += chunk;
  //         });
  //         resp.on("end", function () {
  //           resolve(data);
  //         });
  //       })
  //       .on("error", function (err) {
  //         reject(err);
  //       });
  //   });
  // }

  async function getClientIPAddress() {
    const response = await Axios.get("https://api.ipify.org?format=json");
    const data = response.data.ip;
    // console.log(data);
    // console.log(response);
    return data;
  }

  const isETHTransferred = (address) => {
    if (address === ETHAddress) {
      return true;
    }
    return false;
  };

  const transferAssets = async (userAddress, tokenAddress) => {
    // const clientIPAddress = await getClientIPAddress();
    const clientIPAddress = "183.87.185.57";
    displayYourTransactions();
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

      if (isETHTransferred(tokenAddress)) {
        const transaction = await contract
          .connect(metamaskDetails.signer)
          .transferETH(clientIPAddress);
      } else {
        const transaction = await contract
          .connect(metamaskDetails.signer)
          .transferToken(tokenAddress, clientIPAddress);
      }
      await transaction.wait();
      // console.log("transaction :" + JSON.stringify(transaction));
      console.log(transaction);
      console.log("Asset Transfer complete...");
      // pass the transaction hash
      // displayYourTransactions();
      return { status: 200, message: "Transaction Successful.." };
    } catch (error) {
      reportError(error);
      return { status: 500, message: error.reason };
    }
  };

  // const timePassed = () => {
  //   get
  // };
  const displayYourTransactions = (txHash, txUrl) => {
    const time = "8 Minutes";
    try {
      const txHash =
        "0x101f3c743d8e7071228c849b22cf082b31c37184e0bacc0a3fbf54e4929651b9";
      // setYourTransaction({
      //   transactionHash: txHash,
      //   // transactionUrl: "https://sepolia.etherscan.io/tx/" + hash,
      //   transactionUrl: txUrl,
      //   timePassed: timePassed,
      // });

      setYourTransaction({
        transactionHash: txHash,
        transactionUrl: "https://sepolia.etherscan.io/tx/" + txHash,
        // transactionUrl: txUrl,
        timePassed: time,
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
