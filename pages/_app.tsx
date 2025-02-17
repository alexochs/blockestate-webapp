import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import Moralis from "moralis";
import Layout from "@/components/Layout/Layout";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/700.css";
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = getDefaultConfig({
    appName: 'ImmoVerse',
    projectId: 'YOUR_PROJECT_ID',
    chains: [polygonAmoy],
    transports: {
        [polygonAmoy.id]: http(),
    },
})

const queryClient = new QueryClient()

const theme = extendTheme({
    fonts: {
        heading: `'Raleway', sans-serif`,
        body: `'Raleway', sans-serif`,
    },
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <SessionProvider
                        session={pageProps.session}
                        refetchInterval={10}
                    >
                        <RainbowKitProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </RainbowKitProvider>
                    </SessionProvider>
                </QueryClientProvider>
            </WagmiProvider>
            <Analytics />
        </ChakraProvider>
    );
}
