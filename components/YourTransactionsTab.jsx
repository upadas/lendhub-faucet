import React, { useContext } from "react";
import FaucetContext from "../context/FaucetContext";

const YourTransactionsTab = () => {
  const { yourTransaction } = useContext(FaucetContext);

  console.log(yourTransaction);

  return (
    <div className="flex flex-col justify-start items-center w-full ">
      <div className="flex flex-row justify-around items-center w-full bg-gradient-to-b from-[#212430] to-[#17171a] p-3 rounded-t-xl text-start text-[16px]">
        <h1 className="w-3/4">Your Transactions</h1>
        <h2 className="w-1/4"> Time</h2>
      </div>

      <div className="flex flex-row justify-around items-center w-full p-3 rounded-b-xl text-start text-black text-sm  border border-1">
        <a href={yourTransaction.transactionUrl} className="w-3/4 underline ">
          {yourTransaction.transactionHash}
        </a>
        <h2 className="w-1/4"> {yourTransaction.timePassed}</h2>
      </div>
    </div>
  );
};

export default YourTransactionsTab;
