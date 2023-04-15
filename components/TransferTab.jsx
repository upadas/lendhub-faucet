import React, { useContext, useState } from "react";
import { YourTransactionsTab } from "../components";
import { ETHAddress, DAIAddress, USDCAddress, LINKAddress } from "../addresses";
import FaucetContext from "../context/FaucetContext";
import { toast } from "react-toastify";

const TransferTab = () => {
  const { transferAssets, connectWallet, metamaskDetails } =
    useContext(FaucetContext);
  const [userAddress, setUserAddress] = useState(
    metamaskDetails.currentAccount
  );
  const [isUserAddressValid, setIsUserAddressValid] = useState(true);
  const [tokenAddress, setTokenAddress] = useState(ETHAddress);
  const [isTransferingToken, setIsTransferringToken] = useState(false);

  const validateAddress = (address) => {
    var ethereum_address = require("ethereum-address");
    if (ethereum_address.isAddress(address)) {
      setIsUserAddressValid(true);
      setUserAddress(address);
      console.log("Valid Ethereum address :" + address);
    } else {
      setIsUserAddressValid(false);
      console.log("Invalid Ethereum address :" + address);
    }
  };

  // const
  const handleSendMe = async () => {
    console.log(userAddress);
    console.log(tokenAddress);

    setIsTransferringToken(true);
    try {
      const transaction = await transferAssets(userAddress, tokenAddress);
      if (transaction.status == 200) {
        setIsTransferringToken(false);
        toast.success("Transfer Successful!");
        await connectWallet();
      } else {
        setIsTransferringToken(false);
        toast.error("Transfer Failed!");
      }
    } catch (error) {
      reportError;
      console.log("Error:" + error);
    }
  };

  return (
    <div className="flex justify-center items-center mx-2">
      <div className="flex flex-col w-full md:px-10 bg-slate-100 rounded-3xl py-5 md:py-10 px-2 md:max-w-[900px] md:-mt-14 -mt-10 justify-center items-center text-center">
        <div className="flex justify-between items-center w-full md:mb-10 mb-5">
          <div className="backdrop-blur-xl border border-[#A5A8B6] border-opacity-20 p-2 mr-2 rounded w-1/6 h-10 text-sm md:text-[16px] font-normal">
            <select
              name=""
              id="Asset"
              className="bg-transparent outline-none text-black w-full text-left "
              onChange={(e) => setTokenAddress(e.target.value)}
            >
              <option value={ETHAddress}>ETH</option>
              <option value={DAIAddress}>DAI</option>
              <option value={USDCAddress}>USDC</option>
              <option value={LINKAddress}>LINK</option>
            </select>
          </div>
          <div className="border border-[#A5A8B6] border-opacity-20 p-2 mr-2  rounded w-4/6 h-10 text-sm md:text-[16px]  font-normal">
            <input
              type="text"
              defaultValue={metamaskDetails.currentAccount}
              onChange={(e) => validateAddress(e.target.value)}
              className="bg-transparent outline-none  text-black w-full text-left"
              placeholder="Enter your address ( 0x... )"
            />
          </div>

          {isUserAddressValid ? (
            <button
              className=" border-spacing-1 py-[6px] rounded-[4px] outline-none text-[12px] md:text-[16px] text-white bg-gray-500 hover:bg-purple-500 w-1/6 h-10"
              onClick={() => handleSendMe()}
            >
              {!isTransferingToken && <span>Send Me </span>}
              {isTransferingToken && <span>Sending...</span>}
            </button>
          ) : (
            <button
              className="border-spacing-1 py-[6px] rounded-[4px] outline-none text-[12px] md:text-[16px] text-white bg-gray-500 hover:bg-purple-500 bg-opacity-50 w-1/6 h-10"
              onClick={() => {
                return;
              }}
            >
              Send Me
            </button>
          )}
        </div>

        <YourTransactionsTab />
      </div>
    </div>
  );
};

export default TransferTab;
