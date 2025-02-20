import { Box, Flex, Heading, Select, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { supabase } from "@/lib/supabaseClient";
import { MarketEvent } from "@/helpers/types";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

const FILTER_7DAYS = 0;
const FILTER_30DAYS = 1;
const FILTER_90DAYS = 2;
const FILTER_1YEAR = 3;
const FILTER_ALLTIME = 4;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
};

export default function AssetInvestAnalyticsTab({ events, floorPrice, isRentable, pricePerDay, sharesTotalSupply }: { events: MarketEvent[], floorPrice: number, isRentable: boolean, pricePerDay: number, sharesTotalSupply: number }) {
    dayjs.extend(relativeTime);
    dayjs.extend(LocalizedFormat)

    const pricePerMonth = pricePerDay * 30;

    const allSales = events ? events.filter((e) => e.event.includes("Purchase")).sort((a, b) => a.created_at - b.created_at) : [];
    const allListings = events ? events.filter((e) => e.event.includes("Created")).sort((a, b) => a.created_at - b.created_at) : [];

    const [sales, setSales] = useState(allSales);
    const [salesVolume, setSalesVolume] = useState(0);
    const [salesData, setSalesData] = useState<any>(null);

    const [listings, setListings] = useState(allListings);
    const [listingsData, setListingsData] = useState<any>(null);
    const [filter, setFilter] = useState(FILTER_ALLTIME);

    useEffect(() => {
        setSales(allSales);
        setListings(allListings);

        let salesVolume = 0;
        for (const sale of allSales) {
            salesVolume += sale.price * sale.amount;
        }
        setSalesVolume(salesVolume);

        setSalesData({
            labels: allSales.map((sale) => dayjs(sale.created_at).format("ll").slice(0, 6)),
            datasets: [
                {
                    data: sales.map((sale) => sale.price / 1e6),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        });

        setListingsData({
            labels: listings.map((listing) => dayjs(listing.created_at).format("ll").slice(0, 6)),
            datasets: [
                {
                    data: listings.map((listing) => listing.price / 1e6),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        });
    }, [events, filter]);

    return (
        <Flex flexDir={["column", "row"]} minH="25vh" w="100%">
            <Box w="25%">
                <Select
                    fontSize="lg"
                    w="12rem"
                    h="3rem"
                    value={filter}
                    onChange={(e) => setFilter(parseInt(e.target.value))}
                    rounded="full"
                    variant="outline">
                    <option value={FILTER_7DAYS}>Last 7 days</option>
                    <option value={FILTER_30DAYS}>Last 30 days</option>
                    <option value={FILTER_90DAYS}>Last 90 days</option>
                    <option value={FILTER_1YEAR}>Last year</option>
                    <option value={FILTER_ALLTIME}>All-time</option>
                </Select>
            </Box>

            <Box w="100%" mt={["2rem", "0"]}>
                <SimpleGrid gap="1rem" columns={[1, 3]} w="100%">
                    <Box p="1rem" w="100%" mr="1rem" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Text color="gray.500">Volume</Text>
                        <Heading>{(salesVolume / 1e6).toLocaleString()}$</Heading>
                    </Box>
                    <Box p="1rem" w="100%" mr="1rem" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Text color="gray.500">Sales</Text>
                        <Heading>{sales.length}</Heading>
                    </Box>
                    <Box p="1rem" w="100%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Text color="gray.500">Floor Price</Text>
                        <Heading>{floorPrice ? floorPrice.toLocaleString() + "$" : "N/A"}</Heading>
                    </Box>
                </SimpleGrid>

                {isRentable && <SimpleGrid gap="1rem" columns={[1, 3]} w="100%" mt="1rem">
                    <Box p="1rem" mr="1rem" w="100%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Text color="gray.500">Monthly Recurring Revenue</Text>
                        <Heading>{(pricePerMonth / 1e6).toLocaleString()}$</Heading>
                    </Box>
                    <Box p="1rem" mr="1rem" w="100%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Text color="gray.500">Annual Rate Of Interest</Text>
                        <Heading>{((((((pricePerMonth / 1e6) * 12) * (1 / sharesTotalSupply)) - floorPrice) / floorPrice) * 100).toFixed(2)}%</Heading>
                    </Box>
                    <Box p="1rem" w="100%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Text color="gray.500">Break Even</Text>
                        <Heading>{(floorPrice / ((pricePerMonth / 1e6) * (1 / sharesTotalSupply))).toFixed(2)} Months</Heading>
                    </Box>
                </SimpleGrid>}

                <SimpleGrid gap="1rem" columns={[1, 2]} w="100%" mt="1rem">
                    <Box p="1rem" w="100%" mr="1rem" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Heading>Volume and Price</Heading>
                        <Box minH="auto" w="100%">
                            {salesData && <Line options={options} data={salesData} />}
                        </Box>
                    </Box>
                    <Box p="1rem" w="100%" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                        <Heading>Floor Price</Heading>
                        <Box minH="auto" w="100%">
                            {listingsData && <Line options={options} data={listingsData} />}
                        </Box>
                    </Box>
                </SimpleGrid>
            </Box>
        </Flex >
    );
}