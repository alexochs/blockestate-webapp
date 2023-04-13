import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { Box, Button, Center, Heading, useMediaQuery, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { baseGoerli, polygonMumbai } from "wagmi/chains";
import Head from "next/head";

function SignIn() {
    const isMobile = useMediaQuery("(max-width: 768px)")[0];

    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { requestChallengeAsync } = useAuthRequestChallengeEvm();
    const { push } = useRouter();

    const handleAuth = async (connector: any) => {
        if (isConnected) {
            await disconnectAsync();
        }

        const { account, chain } = await connectAsync({
            connector,
        });

        const { message }: any = await requestChallengeAsync({
            address: account,
            chainId: chain.id,
        });

        const signature = await signMessageAsync({ message });

        // redirect user after success authentication to '/user' page
        const { url }: any = await signIn("moralis-auth", {
            message,
            signature,
            redirect: false,
            callbackUrl: "/profiles/" + account,
        });

        /*
         * instead of using signIn(..., redirect: "/profiles/account")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
        push(url);
    };

    return (
        <Center h="80vh">
            <Head>
                <title>Sign In | ImmoVerse</title>
            </Head>

            {!isMobile ?
                <VStack spacing="1rem">
                    <Heading fontSize="6xl" pb="1rem" textAlign={"center"}>
                        Connect your wallet
                    </Heading>

                    <Button
                        onClick={() => handleAuth(new MetaMaskConnector())}
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        Metamask
                    </Button>

                    <Button
                        onClick={() =>
                            handleAuth(
                                new WalletConnectConnector({
                                    options: { qrcode: true },
                                })
                            )
                        }
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        WalletConnect
                    </Button>

                    <Button
                        onClick={() =>
                            handleAuth(
                                new CoinbaseWalletConnector({
                                    options: {
                                        appName: "wagmi.sh",
                                        jsonRpcUrl:
                                            "https://eth-mainnet.alchemyapi.io/v2/yourAlchemyId",
                                    },
                                })
                            )
                        }
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        Coinbase
                    </Button>

                    <Button
                        onClick={() =>
                            handleAuth(
                                new LedgerConnector({
                                    chains: [polygonMumbai],
                                })
                            )
                        }
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        Ledger
                    </Button>
                </VStack> :
                <Heading fontSize="4xl" pb="1rem" textAlign={"center"}>
                    Sign in is not supported on mobile devices yet.
                </Heading>}
        </Center>
    );
}

export default SignIn;
