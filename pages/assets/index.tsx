import AssetPreviewCard from "@/components/AssetPreviewCard";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { Box, Center, Heading, SimpleGrid, Spinner, Text, Image, Flex, HStack, VStack, Stack, Button, Spacer, Link, Stat, StatHelpText, StatArrow } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import AssetTrendingHero from "@/components/AssetTrendingHero";
import Head from "next/head";
import { useReadContract } from "wagmi";
import { useState, useEffect } from "react";

export default function InvestPage() {
    const [allAssets, setAllAssets] = useState<Asset[]>([]);
    const [loadingAssets, setLoadingAssets] = useState(true);

    const { data: allAssetsData } = useReadContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
    }) as { data: any[] };

    useEffect(() => {
        if (allAssetsData && Array.isArray(allAssetsData)) {
            setAllAssets(
                allAssetsData.map((asset: any) =>
                    Asset.fromSingleEntry(asset)
                )
            );
            setLoadingAssets(false);
        }
    }, [allAssetsData]);

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
                    <Box>
                        {!allAssets ? (
                            <Center>
                                <Spinner size="xl" />
                            </Center>
                        ) : allAssets.length > 0 ? (
                            <SimpleGrid columns={[1, 3]} spacing="2rem">
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