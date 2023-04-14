import Head from "next/head";
import type { NextPage } from "next";
import { Header } from "../components";
import FaucetContext from "../context/FaucetContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { DisconnectedTab, TransferTab } from "../components";

const Home: NextPage = () => {
  const { metamaskDetails } = useContext(FaucetContext);
  return (
    <>
      <Head>
        <title>LendHub Faucet</title>
        <meta name="description" content="Can get assets before testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full m-0 p-0 bg-gradient-to-b from-[#212430] to-[#17171a] h-[17rem] text-white">
        <Header />
        <div className="text-center px-8 md:px-20 md:py-16 py-10">
          <h1 className="pl-2 font-normal text-3xl md:text-5xl">
            LendHub Faucet
          </h1>
          <p className="py-5">
            Enjoy 1 ETH Per day and 10 of each DAI, USDC, LINK
          </p>
        </div>

        {!metamaskDetails.currentAccount ? (
          <DisconnectedTab />
        ) : (
          <TransferTab />
        )}
      </main>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Home;
