import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, goerli } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const { provider, webSocketProvider, chains } = configureChains(
  [mainnet],
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig client={client}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </SessionProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
