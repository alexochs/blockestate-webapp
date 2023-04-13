import { MarketEvent } from "@/helpers/types";
import { Box, Button, Center, Checkbox, CheckboxGroup, Flex, HStack, Icon, Input, Link, Select, Spacer, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';
import BuySharesButton from "./Buttons/BuySharesButton";
import CreateSharesListingButton from "./Buttons/CreateSharesListingButton";
import ListSharesModal from "./Modals/ListSharesModal";
import { supabase } from "@/lib/supabaseClient";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { FaMinusCircle, FaPlusCircle, FaShoppingCart, FaTag } from "react-icons/fa";

export default function AssetInvestActivityTab({ events }: any) {
    dayjs.extend(relativeTime);
    dayjs.extend(LocalizedFormat)

    const [filter, setFilter] = useState(1);
    const [search, setSearch] = useState('')
    const handleSearchChange = (event: any) => {
        setSearch(event.target.value);
    }

    const [showSales, setShowSales] = useState(true);
    const [showLists, setShowLists] = useState(false);
    const [showDeposits, setShowDeposits] = useState(false);
    const [showWithdraws, setShowWithdraws] = useState(false);

    return (
        <Flex flexDir={["column", "row"]} minH="25vh" w="100%">
            <Box w={["100%", "25%"]}>
                <Input
                    value={search}
                    onChange={handleSearchChange}
                    placeholder='0xa71ceB0B...'
                    rounded="full"
                    mb="1rem"
                    w="12rem"
                    h="3rem"
                    fontSize="lg"
                />

                <Select
                    fontSize="lg"
                    w="12rem"
                    h="3rem"
                    mb="1rem"
                    value={filter}
                    onChange={(e) => setFilter(parseInt(e.target.value))}
                    rounded="full"
                    variant="outline"
                >
                    <option value={1}>Date: Latest</option>
                    <option value={2}>Date: Oldest</option>
                </Select>

                <CheckboxGroup colorScheme='blue'>
                    <Stack spacing={".25rem"}>
                        <Checkbox
                            isChecked={showSales}
                            onChange={(e) => setShowSales(e.target.checked)}
                            w="12rem"
                            h="3rem"
                            rounded="full"
                            size="lg"
                            variant="round"
                            style={{ borderRadius: "99px" }}
                        >
                            <Text fontSize="lg">Sales</Text>
                        </Checkbox>

                        <Checkbox
                            isChecked={showLists}
                            onChange={(e) => setShowLists(e.target.checked)}
                            w="12rem"
                            h="3rem"
                            rounded="full"
                            size="lg"
                            variant="round"
                            style={{ borderRadius: "99px" }}
                        >
                            <Text fontSize="lg">Listings</Text>
                        </Checkbox>

                        <Checkbox
                            isChecked={showDeposits}
                            onChange={(e) => setShowDeposits(e.target.checked)}
                            w="12rem"
                            h="3rem"
                            rounded="full"
                            size="lg"
                            variant="round"
                            style={{ borderRadius: "99px" }}
                        >
                            <Text fontSize="lg">Deposits</Text>
                        </Checkbox>

                        <Checkbox
                            isChecked={showWithdraws}
                            onChange={(e) => setShowWithdraws(e.target.checked)}
                            w="12rem"
                            h="3rem"
                            rounded="full"
                            size="lg"
                            variant="round"
                            style={{ borderRadius: "99px" }}
                        >
                            <Text fontSize="lg">Withdraws</Text>
                        </Checkbox>
                    </Stack>
                </CheckboxGroup>
            </Box>

            <Box ml={["-10vw", "0"]} mt={["2rem", "0"]} w={["100vw", "100%"]} border="1px solid rgb(0,0,0,0.0)" rounded="3xl">
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th fontSize={["sm", "lg"]}>Event</Th>
                                <Th fontSize={["sm", "lg"]}>Listing</Th>
                                <Th fontSize={["sm", "lg"]}>Price</Th>
                                <Th fontSize={["sm", "lg"]}>Amount</Th>
                                <Th fontSize={["sm", "lg"]}>Seller</Th>
                                <Th fontSize={["sm", "lg"]}>Buyer</Th>
                                <Th fontSize={["sm", "lg"]}>Time</Th>
                            </Tr >
                        </Thead>
                        <Tbody fontSize={["lg", "xl"]}>
                            {events ?
                                events
                                    .filter((event: MarketEvent) => (event.seller && event.seller.includes(search) || (event.buyer && event.buyer.includes(search) || !event.seller && !event.buyer)))
                                    .filter((event: MarketEvent) => (event.event === "SharesListingPoolCreated" && showLists) ||
                                        (event.event === "SharesListingPoolPurchase" && showSales) ||
                                        (event.event === "SharesListingPoolDeposit" && showDeposits) ||
                                        (event.event === "SharesListingPoolWithdraw" && showWithdraws) ||
                                        (!showLists && !showSales && !showDeposits && !showWithdraws))
                                    .sort((a: MarketEvent, b: MarketEvent) => filter === 1 ?
                                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() :
                                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                    .map((event: MarketEvent) =>
                                        <Tr key={event.id}>
                                            <Td>
                                                <Flex>
                                                    {event.event === "SharesListingPoolCreated" ? <Icon as={FaTag} /> :
                                                        event.event === "SharesListingPoolDeposit" ? <Icon as={FaPlusCircle} /> :
                                                            event.event === "SharesListingPoolWithdraw" ? <Icon as={FaMinusCircle} /> :
                                                                event.event === "SharesListingPoolPurchase" ? <Icon as={FaShoppingCart} /> : ""}

                                                    <Text ml=".5rem" fontWeight="bold">
                                                        {event.event === "SharesListingPoolCreated" ? "List" :
                                                            event.event === "SharesListingPoolDeposit" ? "Deposit" :
                                                                event.event === "SharesListingPoolWithdraw" ? "Withdraw" :
                                                                    event.event === "SharesListingPoolPurchase" ? "Sale" : ""}
                                                    </Text>
                                                </Flex>
                                            </Td>

                                            <Td>
                                                <Text color="blue.500" fontWeight="bold" cursor="pointer">
                                                    #{event.sharesListingPoolId}
                                                </Text>
                                            </Td>

                                            <Td>
                                                <Text fontWeight="bold">
                                                    {event.price ? (event.price / 1e6).toLocaleString() + "$" : "---"}
                                                </Text>
                                            </Td>

                                            <Td>
                                                <Text>
                                                    {event.amount}
                                                </Text>
                                            </Td>

                                            <Td>
                                                {event.seller ?
                                                    <Link href={"/profiles/" + event.seller} target="_blank">
                                                        <Text color="blue.500">{event.seller.slice(2, 8)}</Text>
                                                    </Link> : <Text>---</Text>}
                                            </Td>

                                            <Td>
                                                {event.buyer ?
                                                    <Link href={"/profiles/" + event.buyer} target="_blank">
                                                        <Text color="blue.500">{event.buyer.slice(2, 8)}</Text>
                                                    </Link> : <Text>---</Text>}
                                            </Td>

                                            <Td>
                                                <Tooltip hasArrow label={dayjs(event.created_at).format("LLL")} placement="top" px="1rem" py="1rem" fontSize="md" rounded="full" fontWeight={"bold"}>
                                                    <Link href={"https://mumbai.polygonscan.com/tx/" + event.tx} target="_blank">
                                                        <Text color="blue.500">{dayjs(event.created_at).fromNow()}</Text>
                                                    </Link>
                                                </Tooltip>
                                            </Td>
                                        </Tr>) : <Text>No events!</Text>}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box >
        </Flex >
    );
}