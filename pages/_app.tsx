import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import FaucetState from "../context/FaucetState";
const inter = Inter({ subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <FaucetState>
        <Component {...pageProps} />
      </FaucetState>
    </main>
  );
}
