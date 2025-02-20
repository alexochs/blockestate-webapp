import { Box, Button, Center, Flex, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "helpers/BlockEstateAssets.json";
import { Asset } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreviewCard";
import Head from "next/head";
import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';
import AssetTrendingHero from "@/components/AssetTrendingHero";

export async function getServerSideProps() {
    const client = createPublicClient({
        chain: polygonAmoy,
        transport: http()
    });

    // read all assets
    const allAssetsData = await client.readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
    }) as any[];

    const allAssets = allAssetsData.map((asset: any) =>
        Asset.fromSingleEntry(asset)
    );

    return {
        props: {
            allAssets: JSON.parse(JSON.stringify(allAssets)),
        },
    };
}

export default function HomePage({ allAssets }: { allAssets: Asset[] }) {
    return (
        <>
            <Head>
                <title>ImmoVerse</title>
            </Head>
            <Box>
                {allAssets && allAssets.length > 0 ? (
                    <>
                        {/*<AssetTrendingHero asset={allAssets[0]} />*/}
                        <SimpleGrid columns={[1, 3]} spacing="2rem">
                            {allAssets.map((asset: any) => (
                                <AssetPreview key={asset.tokenId} asset={asset} />
                            ))}
                        </SimpleGrid>
                    </>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>No assets have been tokenized yet.</Text>
                        <Text fontWeight={"bold"}>Be the first one!</Text>
                    </Center>
                )}
            </Box>
        </>
    );
}