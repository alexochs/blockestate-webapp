import { metaMask, injected } from "wagmi/connectors";
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

        const { accounts, chainId } = await connectAsync({
            connector,
        });

        const { message }: any = await requestChallengeAsync({
            address: accounts[0],
            chainId: chainId,
        });

        const signature = await signMessageAsync({ message });

        // redirect user after success authentication to '/user' page
        const { url }: any = await signIn("moralis-auth", {
            message,
            signature,
            redirect: false,
            callbackUrl: "/profiles/" + accounts[0],
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
                        onClick={() => handleAuth(injected({ target: 'metaMask' }))}
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        Metamask
                    </Button>

                    <Button
                        isDisabled
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        WalletConnect
                    </Button>

                    <Button
                        isDisabled
                        rounded="full"
                        w="16rem"
                        size="lg"
                        variant="outline"
                    >
                        Coinbase
                    </Button>

                    <Button
                        isDisabled
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
