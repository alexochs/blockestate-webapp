import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, goerli, polygonMumbai, baseGoerli } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import Moralis from "moralis";
import Layout from "@/components/Layout/Layout";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/700.css";
import { Analytics } from '@vercel/analytics/react';

const { provider, webSocketProvider, chains } = configureChains(
    [polygonAmoy],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "ImmoVerse",
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

const theme = extendTheme({
    fonts: {
        heading: `'Raleway', sans-serif`,
        body: `'Raleway', sans-serif`,
    },
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={client}>
                <SessionProvider
                    session={pageProps.session}
                    refetchInterval={10}
                >
                    <RainbowKitProvider chains={chains}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </RainbowKitProvider>
                </SessionProvider>
            </WagmiConfig>
            <Analytics />
        </ChakraProvider>
    );
}
