import { Box, Button, Center, Flex, Heading, Link, SimpleGrid, Text, Skeleton, Stack, HStack, Stat, StatHelpText, StatArrow, Spacer } from "@chakra-ui/react";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "helpers/BlockEstateAssets.json";
import AssetPreview from "@/components/AssetPreviewCard";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { marketContractAddress, rentalsContractAddress } from "@/helpers/contractAddresses";
import { Asset, MarketEvent, SharesListingPool } from "@/helpers/types";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import { supabase } from "@/lib/supabaseClient";

export default function AssetTrendingHero({ asset }: { asset: Asset }) {
    const [trendingAsset, setTrendingAsset] = useState<Asset | null>(null);
    const [loading, setLoading] = useState(true);
    const [floorPrice, setFloorPrice] = useState(0);
    const [salesVolume, setSalesVolume] = useState<number>(0);
    const [pricePerMonth, setPricePerMonth] = useState(0);

    const { data: listingPoolsData } = useReadContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readSharesListingPoolsByAsset",
        args: [BigInt(asset.tokenId)],
    }) as { data: any[] };

    const { data: pricePerDayData } = useReadContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerDay",
        args: [BigInt(asset.tokenId)],
    });

    useEffect(() => {
        if (listingPoolsData && Array.isArray(listingPoolsData)) {
            const listingPools = listingPoolsData
                .map((listingPoolData: any) => SharesListingPool.fromSingleEntry(listingPoolData))
                .filter((listingPool: SharesListingPool) => listingPool.tokenId != 0 && listingPool.amount > 0);

            const floorListingPool = listingPools.sort((a: SharesListingPool, b: SharesListingPool) => a.price - b.price)[0];
            const floorPrice = floorListingPool ? (floorListingPool.price / 10 ** 6) : 0;

            setFloorPrice(floorPrice);
        }
    }, [listingPoolsData]);

    useEffect(() => {
        if (pricePerDayData) {
            setPricePerMonth(Number(pricePerDayData) / 1e6 * 30);
        }
    }, [pricePerDayData]);

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('market')
            .select('*')
            .eq("tokenId", trendingAsset?.tokenId);

        const events = data as MarketEvent[];
        const sales = events.filter((e) => e.event.includes("Purchase")).sort((a, b) => a.created_at - b.created_at);

        let salesVolume = -1;
        for (const sale of sales) {
            salesVolume += sale.price * sale.amount;
        }

        setSalesVolume(salesVolume / 1e6);
    }

    useEffect(() => {
        if (!salesVolume) fetchEvents();
        if (trendingAsset && floorPrice && salesVolume) setLoading(false);
    }, [trendingAsset, floorPrice, salesVolume]);

    if (!loading) {
        return (
            <Link href={"/assets/" + asset.tokenId} cursor="pointer" style={{ textDecoration: "none" }}>
                <Box w="100%"
                    rounded="3xl"
                    h="65vh"
                    bgImage={"url(https://cdn.fertighauswelt.de/85c04f5301d5d668cbbfb45e848a68a5ab7bfb6d/villa-bauen.jpg)"}
                    bgSize="cover"
                    boxShadow={"inset 0px 0px 1000px 10000px rgb(0,0,0,.25)"}
                >
                    <Stack textAlign={"start"} px="2rem" top="25vh" bottom="0" spacing="2rem" color="whiteAlpha.900">
                        <Stack spacing="-1rem" pt="25vh">
                            <Text fontSize="7xl" fontWeight="bold">{(asset.street).toUpperCase()} {asset.number}</Text>
                            <Text fontSize="4xl" color="whiteAlpha.800">{asset.city}, {asset.country}</Text>
                        </Stack>

                        <Flex alignItems="center" w="75vw">
                            <HStack spacing="4rem">
                                <Stack spacing="-.25rem">
                                    <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">Floor</Text>
                                    <Text fontSize="2xl">{floorPrice ? floorPrice.toLocaleString() + "$" : "N/A"}</Text>
                                    <Stat>
                                        <StatHelpText>
                                            <StatArrow type='increase' />
                                            5.36%
                                        </StatHelpText>
                                    </Stat>
                                </Stack>

                                <Stack spacing="-.25rem">
                                    <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">24h Volume</Text>
                                    <Text fontSize="2xl">{salesVolume === -1 ? "N/A" : salesVolume.toLocaleString() + "$"}</Text>
                                    <Stat>
                                        <StatHelpText>
                                            <StatArrow type='increase' />
                                            23.36%
                                        </StatHelpText>
                                    </Stat>
                                </Stack>

                                <Stack spacing="-.25rem">
                                    <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">Annual ROI</Text>
                                    <Text fontSize="2xl">168%</Text>
                                    <Stat>
                                        <StatHelpText>
                                            <StatArrow type='increase' />
                                            2.12%
                                        </StatHelpText>
                                    </Stat>
                                </Stack>
                            </HStack>

                            <Spacer />

                            <Button size="lg" fontSize="xl" colorScheme={"whiteAlpha"} variant="solid" rounded="full">View Asset</Button>
                        </Flex>
                    </Stack>
                </Box>
            </Link>
        )
    } else return <Skeleton w="100%" h="65vh" rounded="3xl" />;
}