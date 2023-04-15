import React from "react";
import { metamask } from "../assets";
import { ConnectWalletButton } from "../components";
import Image from "next/image";

const DisconnectedTab = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-gradient-to-r from-pink-100 via-purple-200 to-pink-100 flex flex-col w-full bg-slate-100 rounded-3xl py-5 md:py-10 px-2 md:max-w-[900px] md:-mt-14 -mt-10 mx-2 justify-center items-center text-center">
        <Image
          src={metamask}
          alt="metamask"
          className="w-24 h-24 md:w-32 md:h-32 mb-3"
        />
        <h1 className=" text-xl font-semibold text-[#303549] mb-2">
          Please connect your wallet with Sepolia Network
        </h1>
        <p className="text-sm font-medium text-[#303549] mb-5">
          and request test ETH or Tokens for{" "}
          <a
            href="https://lendhub.netlify.app/"
            target="_blank"
            className="underline"
          >
            LendHub
          </a>
        </p>
        <ConnectWalletButton />
      </div>
    </div>
  );
};

export default DisconnectedTab;
