import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createClient, configureChains, WagmiConfig, Chain } from "wagmi";
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

export const polygonAmoy = {
    id: 80_002,
    name: 'Polygon Amoy',
    network: 'amoy',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: {
        public: { http: ['https://rpc-amoy.polygon.technology'] },
        default: { http: ['https://rpc-amoy.polygon.technology'] },
    },
    blockExplorers: {
        etherscan: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
        default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 3127388,
        },
    },
    testnet: true,
} as const satisfies Chain;

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
