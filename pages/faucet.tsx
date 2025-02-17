import { Box, Button, Center, Flex, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { assetsContractAddress, sharesContractAddress, usdTokenAddress } from "@/helpers/contractAddresses";
import { abi as sharesAbi } from "helpers/BlockEstateShares.json";
import { abi as usdAbi } from "helpers/USDToken.json";
import { abi as assetsAbi } from "helpers/BlockEstateAssets.json";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import { readContract } from "@wagmi/core";
import AssetPreview from "@/components/AssetPreviewCard";
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import router from "next/router";
import Head from "next/head";
import { useEffect } from "react";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    console.log("session", session);
    console.log("session.user", session.user);

    return {
        props: {
            user: session.user,
        },
    };
}

export default function FaucetPage({ user }: any) {
    const {
        data,
    } = useSimulateContract({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "faucet",
    });

    const { writeContract, data: hash } = useWriteContract();

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            router.push("/my-funds");
        }
    }, [isSuccess]);

    return (
        <>
            <Head>
                <title>Faucet | ImmoVerse</title>
            </Head>
            <Box>
                <Heading fontSize="8xl" mb="2rem">Faucet</Heading>

                <Flex>
                    <Box w="50%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl" p="1rem" h="20rem">
                        <Heading>
                            Drip some POL
                        </Heading>

                        <Link href="https://faucet.stakepool.dev.br/amoy" target="_blank" style={{ textDecoration: "none" }}>
                            <Button mt="2rem" size="lg" w="100%" rounded="full" colorScheme="blue">Polygon Faucet</Button>
                        </Link>
                    </Box>

                    <Box ml="1rem" w="50%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl" p="1rem" h="20rem">
                        <Heading>
                            Mint USD Tokens
                        </Heading>

                        <Button isLoading={isLoading} isDisabled={!Boolean(data?.request) || !user} onClick={() => writeContract(data!.request)} mt="2rem" size="lg" w="100%" rounded="full" colorScheme="blue">Mint {(100_000).toLocaleString()}$</Button>
                    </Box>
                </Flex>
            </Box>
        </>
    );
}
