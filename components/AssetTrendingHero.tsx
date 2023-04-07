import { marketContractAddress, rentalsContractAddress } from "@/helpers/contractAddresses";
import { Asset, MarketEvent, SharesListingPool } from "@/helpers/types";
import { Box, Button, Flex, HStack, Spacer, Stack, Stat, StatArrow, StatHelpText, Text, Link, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import { supabase } from "@/lib/supabaseClient";

export default function AssetTrendingHero({ asset }: { asset: Asset }) {

    const [loading, setLoading] = useState(true);
    const [floorPrice, setFloorPrice] = useState(0);
    const [salesVolume, setSalesVolume] = useState<number>(0);
    const [pricePerMonth, setPricePerMonth] = useState(0);

    const readFloorPrice = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readSharesListingPoolsByAsset",
        args: [asset.tokenId],
        onSuccess: (result: any) => {
            const listingPools = result
                .map((listingPoolData: any) => SharesListingPool.fromSingleEntry(listingPoolData))
                .filter((listingPool: SharesListingPool) => listingPool.tokenId != 0 && listingPool.amount > 0);

            const floorListingPool = listingPools.sort((a: SharesListingPool, b: SharesListingPool) => a.price - b.price)[0];
            const floorPrice = floorListingPool ? (floorListingPool.price / 10 ** 6) : 0;

            setFloorPrice(floorPrice);
        }
    });

    const readPricePerMonth = useContractRead({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerDay",
        args: [asset.tokenId],
        onSuccess(result: any) {
            setPricePerMonth(parseInt(result._hex, 16) / 1e6 * 30);
        }
    });

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('market')
            .select('*')
            .eq("tokenId", asset.tokenId);

        const events = data as MarketEvent[];
        const sales = events.filter((e) => e.event.includes("Purchase")).sort((a, b) => a.created_at - b.created_at);

        let salesVolume = -1;
        for (const sale of sales) {
            salesVolume += sale.price * sale.amount;
        }
        setSalesVolume(salesVolume);
    }

    useEffect(() => {
        if (!salesVolume) fetchEvents();
        if (asset && floorPrice && salesVolume) setLoading(false);
    }, [asset, floorPrice, salesVolume]);

    if (!loading) {
        return (
            <Link href={"/invest/" + asset.tokenId} cursor="pointer" style={{ textDecoration: "none" }}>
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