import React, { useContext, useState } from "react";
import { YourTransactionsTab } from "../components";
import { ETHAddress, DAIAddress, USDCAddress, LINKAddress } from "../addresses";
import faucetContext from "../context/faucetContext";
import { toast } from "react-toastify";

const TransferTab = () => {
  const { transferAssets, connectWallet } = useContext(faucetContext);
  const [userAddress, setUserAddress] = useState("");
  const [isUserAddressValid, setIsUserAddressValid] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(ETHAddress);
  const [isTransferingToken, setisTransferingToken] = useState(false);

  const validateAddress = (address) => {
    if (address) {
      var pattern = new RegExp(/^0x[a-fA-F0-9]{40}$/);
      if (!pattern.test(address)) {
        setIsUserAddressValid(false);
        setUserAddress("");
      } else {
        setUserAddress(address);
        setIsUserAddressValid(true);
      }
    }
  };

  const handleSendMe = async () => {
    console.log(userAddress);
    console.log(tokenAddress);

    setisTransferingToken(true);
    const transaction = await transferAssets(userAddress, tokenAddress);
    if (transaction.status == 200) {
      setisTransferingToken(false);
      toast.success(`Transfer Successfully !`);
      await connectWallet();
    } else {
      setisTransferingToken(false);
      toast.error("Repay Failed");
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="flex flex-col w-full md:px-10 bg-white rounded-3xl py-5 md:py-10 px-2 md:max-w-[900px] -mt-14  justify-center items-center text-center ">
        <div className="flex justify-between items-center w-full mb-10">
          <div className="border border-[#A5A8B6] border-opacity-20 p-2  mr-2 rounded w-1/6 h-10 text-md font-normal">
            <select
              name=""
              id=""
              className="bg-transparent outline-none text-black w-full text-left px-1"
              onChange={(e) => setTokenAddress(e.target.value)}
            >
              <option value={ETHAddress}>ETH</option>
              <option value={DAIAddress}>DAI</option>
              <option value={USDCAddress}>USDC</option>
              <option value={LINKAddress}>LINK</option>
            </select>
          </div>
          <div className="border border-[#A5A8B6] border-opacity-20 p-2 mr-2  rounded w-4/6 h-10 text-md font-normal">
            <input
              type="text"
              onChange={(e) => validateAddress(e.target.value)}
              className="bg-transparent outline-none  text-black w-full text-left px-1"
              placeholder="Enter your address ( Ox... )"
            />
          </div>

          {isUserAddressValid ? (
            <button
              className="border-spacing-1 py-[6px] rounded-[4px] outline-none text-[12px] md:text-[13px]  text-white bg-[#212430] hover:bg-[#383D51] w-1/6 h-10"
              onClick={() => handleSendMe()}
            >
              Send Me
            </button>
          ) : (
            <button
              className="border-spacing-1 py-[6px] rounded-[4px] outline-none text-[12px] md:text-[13px]  text-white bg-[#383D51] bg-opacity-50 w-1/6 h-10"
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
