import AssetRentPreviewCard from "@/components/AssetRentPreviewCard";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { Box, Center, Heading, SimpleGrid, Spinner, Text, Image, Flex, HStack, VStack, Stack, Button, Spacer, Link, Stat, StatHelpText, StatArrow, Input, Switch, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import AssetTrendingHero from "@/components/AssetTrendingHero";
import { useState } from "react";

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
    const [assets, setAssets] = useState(allAssets);
    const [filterFixed, setFilterFixed] = useState(false);
    const [filterMonthly, setFilterMonthly] = useState(false);

    const [search, setSearch] = useState('')
    const handleSearchChange = (event: any) => {
        setSearch(event.target.value)

        if (event.target.value === '') {
            setAssets(allAssets)
            return
        }

        const filteredAssets = allAssets.filter((asset: any) => {
            return asset.city.toLowerCase().includes(event.target.value.toLowerCase()) ||
                asset.country.toLowerCase().includes(event.target.value.toLowerCase())
        });
        setAssets(filteredAssets);
    }

    return (
        <Box>
            <Heading fontSize="8xl">
                Find a place to stay
            </Heading>

            <HStack my="2rem" spacing="1rem">
                <Input value={search} onChange={handleSearchChange} type="text" size="lg" placeholder="Explore a location" w="24rem" rounded="full"></Input>

                <Button fontWeight={"normal"} rounded="full" variant={filterFixed ? "outline" : "solid"} size="lg" onClick={() => setFilterFixed(!filterFixed)}>Bed & Breakfast</Button>

                <Button fontWeight={"normal"} rounded="full" variant={filterMonthly ? "outline" : "solid"} size="lg" onClick={() => setFilterMonthly(!filterMonthly)}>Monthly</Button>
            </HStack>

            {!allAssets ? (
                <Center>
                    <Spinner size="xl" />
                </Center>
            ) : allAssets.filter((asset: Asset) => asset).length > 0 ? (
                <SimpleGrid columns={[2, 3]} spacing="1rem">
                    {assets.map((asset: any) => (
                        <AssetRentPreviewCard asset={asset} filterFixed={filterFixed} filterMonthly={filterMonthly} />
                    ))}
                </SimpleGrid>
            ) : (
                <Center flexDir={"column"}>
                    <Text>No assets have been tokenized yet.</Text>
                    <Text fontWeight={"bold"}>Be the first one!</Text>
                </Center>
            )}
        </Box>
    );
}