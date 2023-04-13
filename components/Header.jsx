import React from "react";
import { ConnectWalletButton } from "../components";

const Header = () => {
  return (
    <nav className="w-full h-15 text-white flex py-2 px-4 lg:px-10 justify-end items-center border-b-[1px] border-gray-400">
      {/* <a href="/">
        <Image src={logo} alt="Ether icon" className="w-40 hover:opacity-80" />
      </a> */}
      <ConnectWalletButton />
    </nav>
  );
};

export default Header;
