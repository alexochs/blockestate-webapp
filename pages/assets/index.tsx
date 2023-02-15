import {
    Box,
    Button,
    Center,
    GridItem,
    Heading,
    Link,
    SimpleGrid,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import {
    assetsContractAddress,
    sharesContractAddress,
} from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import { Asset } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import { getSession, useSession } from "next-auth/react";

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

    // read all assets
    const allAssetsData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
    })) as any;

    const allAssets = allAssetsData.map((asset: any) =>
        Asset.fromSingleEntry(asset)
    );

    // read history of held shares
    const tokenHistoryData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readSharesByHolder",
        args: [session.user?.address],
    })) as any;

    const tokenHistory = tokenHistoryData
        .map((share: any) => parseInt(share._hex, 16))
        .filter(
            (value: number, index: number, array: number[]) =>
                array.indexOf(value) === index
        );

    // read balances of held shares
    const sharesBalancesData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOfBatch",
        args: [
            Array(tokenHistory.length).fill(session.user?.address),
            tokenHistory,
        ],
    })) as any;

    const sharesBalances = sharesBalancesData.map((balance: any) =>
        parseInt(balance._hex, 16)
    );

    // create tokenId + balance pairs and filter out 0 balances
    const shares = sharesBalances
        .map((balance: number, index: number) => ({
            tokenId: tokenHistory[index],
            balance,
        }))
        .filter((share: any) => share.balance > 0);

    return {
        props: {
            user: session.user,
            allAssets: JSON.parse(JSON.stringify(allAssets)),
            shares,
        },
    };
}

export default function AssetsPage({ user, allAssets, shares }: any) {
    const userAssets = allAssets.filter((asset: any) =>
        shares.find((share: any) => share.tokenId === asset.tokenId)
    );

    return (
        <Box>
            {user && (
                <Box minH="50vh">
                    <Heading fontSize="8xl" pb="2rem">
                        Your Assets
                    </Heading>

                    <Box pb="2rem">
                        <Link
                            href="/assets/create"
                            style={{ textDecoration: "none" }}
                        >
                            <Button
                                rounded="xl"
                                colorScheme="blue"
                                size="lg"
                                border="1px solid black"
                            >
                                Tokenize your Asset
                            </Button>
                        </Link>
                    </Box>

                    {userAssets && userAssets.length > 0 ? (
                        <SimpleGrid columns={[2, 3]} spacing="1rem">
                            {userAssets.map((asset: any) => (
                                <AssetPreview asset={asset} />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Center flexDir={"column"}>
                            <Text>You don't own any assets yet.</Text>
                            <Text fontWeight={"bold"}>Tokenize one now!</Text>
                        </Center>
                    )}
                </Box>
            )}

            <Box minH="50vh">
                <Heading fontSize="8xl" pt="8rem" pb="2rem">
                    Explore Assets
                </Heading>

                {!allAssets ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : allAssets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {allAssets.map((asset: any) => (
                            <AssetPreview asset={asset} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>No assets have been tokenized yet.</Text>
                        <Text fontWeight={"bold"}>Be the first one!</Text>
                    </Center>
                )}
            </Box>
        </Box>
    );
}
