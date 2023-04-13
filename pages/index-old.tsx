import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Box, Button, Center, Flex, Heading, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { useContractRead } from "wagmi";
import { useState } from "react";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { Asset } from "@/helpers/types";
import AssetTrendingHero from "@/components/AssetTrendingHero";

export default function Home() {
    const [allAssets, setAllAssets] = useState<Asset[]>([]);
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
                <title>ImmoVerse | Real Estate Investing Made Easy</title>
                <meta
                    name="description"
                    content="ImmoVerse is a decentralized real estate marketplace. Invest in real estate, find your new home, and more. 100% on-chain. 100% transparent. 100% secure."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Box>
                    {allAssets.length > 0 && <AssetTrendingHero asset={allAssets[0]} />}

                    {/*<Box mt="2rem" p="1rem" bg="gray.100" rounded="3xl">
                        <Heading>Trending</Heading>
                    </Box>*/}
                </Box>
            </main >
        </>
    );
}
