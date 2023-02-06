import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, goerli, polygonMumbai } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import Moralis from "moralis";
import Layout from "@/components/Layout/Layout";

const { provider, webSocketProvider, chains } = configureChains(
    [polygonMumbai],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "BlockEstate",
    chains,
});

const client = createClient({
    provider,
    webSocketProvider,
    autoConnect: true,
    connectors,
});

/*Moralis.start({
  apiKey: "s2suL7NNBzruq1sh5388dE8gGvHfryjc4GuskhPInusulgHK6siJguaWzdCjgeya",
});*/

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <WagmiConfig client={client}>
                <SessionProvider
                    session={pageProps.session}
                    refetchInterval={0}
                >
                    <RainbowKitProvider chains={chains}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </RainbowKitProvider>
                </SessionProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
}
