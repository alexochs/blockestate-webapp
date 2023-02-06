import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { polygonMumbai } from "wagmi/chains";

function SignIn() {
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
            callbackUrl: "/user",
        });

        /*
         * instead of using signIn(..., redirect: "/user")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
        push(url);
    };

    return (
        <Center h="80vh">
            <VStack spacing="1rem">
                <Heading fontSize="6xl" pb="1rem">
                    Connect your wallet
                </Heading>

                <Button
                    onClick={() => handleAuth(new MetaMaskConnector())}
                    rounded="xl"
                    w="16rem"
                    size="lg"
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
                    rounded="xl"
                    w="16rem"
                    size="lg"
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
                    rounded="xl"
                    w="16rem"
                    size="lg"
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
                    rounded="xl"
                    w="16rem"
                    size="lg"
                >
                    Ledger
                </Button>
            </VStack>
        </Center>
    );
}

export default SignIn;
