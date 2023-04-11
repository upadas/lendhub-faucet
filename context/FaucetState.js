import React, { useState } from "react";
import FaucetContext from "./FaucetContext";
import { ethers } from "ethers";
const {
  DAI_USD_ADDRESS,
  USDC_USD_ADDRESS,
  LINK_USD_ADDRESS,
} = require("../addresses");

// Set metamask details
const [metamaskDetails, setMetamaskDetails] = useState({
  provider: null,
  networkName: null,
  signer: null,
  currentAccount: null,
});

const FaucetState = (props) => {
  const connectWallet = async () => {
    console.log("Connecting to MetaMask wallet...");

    // First, check if Metamask is installed
    if (typeof window.ethereum !== "undefined") {
      console.log("Metamask is installed!");
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
      } catch (error) {
        reportError(error);
      }
    } else {
      alert("MetaMask is not installed, please install and try again");
      console.log("MetaMask is not installed, please install and try again");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const networkName = network.name;
      const signer = provider.getSigner();

      // if (networkName != "sepolia") {
      //   alert("Please switch your network to Sepolia Testnet");
      //   return;
      // }

      if (accounts.length) {
        let currentAddress = accounts[0];
        setMetamaskDetails({
          provider: provider,
          networkName: networkName,
          signer: signer,
          currentAccount: currentAddress,
        });
        console.log("Connected to wallet....");
      } else {
        alert(
          "Could not retrieve accounts from the wallet, Please create accounts an retry"
        );
        console.log("Could not retrieve accounts from the wallet");
        return;
      }
    } catch (error) {
      report(error);
    }

    return (
      <FaucetContext.Provider
        value={{
          metamaskDetails,
          connectWallet,
        }}
      >
        {props.children}
      </FaucetContext.Provider>
    );
  };
};

export default FaucetState;
