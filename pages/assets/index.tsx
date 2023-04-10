import AssetPreviewCard from "@/components/AssetPreviewCard";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { Box, Center, Heading, SimpleGrid, Spinner, Text, Image, Flex, HStack, VStack, Stack, Button, Spacer, Link, Stat, StatHelpText, StatArrow } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import AssetTrendingHero from "@/components/AssetTrendingHero";
import Head from "next/head";
import { useContractRead } from "wagmi";
import { useState } from "react";

export default function InvestPage() {
    const [allAssets, setAllAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(true);

    const readAllAssets = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
        onSuccess: (allAssetsData: any) => {
            setAllAssets(
                allAssetsData.map((asset: any) =>
                    Asset.fromSingleEntry(asset)
                )
            )

            setLoadingAssets(false);
        },
    });

    return (
        <>
            <Head>
                <title>Assets | ImmoVerse</title>
            </Head>
            {loadingAssets ?
                <Center minH="50vh">
                    <Spinner size="xl" />
                </Center> :
                <Box>
                    {allAssets.length > 0 && <AssetTrendingHero asset={allAssets[0]} />}

                    <Box pt="4rem">
                        {!allAssets ? (
                            <Center>
                                <Spinner size="xl" />
                            </Center>
                        ) : allAssets.length > 0 ? (
                            <SimpleGrid columns={[2, 3]} spacing="1rem">
                                {allAssets.map((asset: any) => (
                                    <AssetPreviewCard key={asset.tokenId} asset={asset} />
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Center flexDir={"column"}>
                                <Text>No assets have been tokenized yet.</Text>
                                <Text fontWeight={"bold"}>Be the first one!</Text>
                            </Center>
                        )}
                    </Box>
                </Box>}
        </>
    );
}