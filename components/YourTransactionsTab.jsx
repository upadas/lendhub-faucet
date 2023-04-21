import React, { useContext } from "react";
import FaucetContext from "../context/FaucetContext";

const YourTransactionsTab = () => {
  const { yourTransaction } = useContext(FaucetContext);

  console.log(yourTransaction);

  return (
    <div className="flex bg-slate-50 flex-col justify-start items-center w-full ">
      <div className="flex bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex-row justify-around items-center w-full p-3 rounded-t-xl text-start text-md">
        <h1 className="w-3/4 ">Your Transactions</h1>
        <h2 className="w-1/4"> Time</h2>
      </div>

      <div className="flex bg-slate-50 flex-row justify-around items-center w-full p-3 rounded-b-xl text-start text-black text-[13px] border border-1">
        <a
          href={
            yourTransaction.transactionUrl && yourTransaction.transactionUrl
          }
          className="w-3/4 underline truncate pr-5"
        >
          {yourTransaction.transactionHash && yourTransaction.transactionHash}
        </a>
        <h2 className="w-1/4">
          {" "}
          {yourTransaction.timePassed && yourTransaction.timePassed}
        </h2>
      </div>
    </div>
  );
};

export default YourTransactionsTab;
