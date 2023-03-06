import AssetPreviewCard from "@/components/AssetPreviewCard";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { Box, Center, Heading, SimpleGrid, Spinner, Text, Image, Flex, HStack, VStack, Stack, Button, Spacer, Link, Stat, StatHelpText, StatArrow } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import AssetTrendingHero from "@/components/AssetTrendingHero";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }
    const allAssetsData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
    })) as any;

    const allAssets = allAssetsData.map((asset: any) =>
        Asset.fromSingleEntry(asset)
    );


    return {
        props: {
            user: session.user,
            allAssets: JSON.parse(JSON.stringify(allAssets)),
        },
    };
}

export default function InvestPage({ allAssets }: any) {
    return (
        <Box>
            <AssetTrendingHero />

            <Box pt="4rem">
                <Heading fontSize="8xl" pb="2rem">
                    Explore Investments
                </Heading>

                {!allAssets ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : allAssets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {allAssets.map((asset: any) => (
                            <AssetPreviewCard asset={asset} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>No assets have been tokenized yet.</Text>
                        <Text fontWeight={"bold"}>Be the first one!</Text>
                    </Center>
                )}
            </Box>
        </Box >
    );
}