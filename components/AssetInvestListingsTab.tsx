import { SharesListing, SharesListingPool } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Link, Select, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';
import CreateSharesListingPoolModal from "./Modals/CreateSharesListingPoolModal";

export default function AssetInvestListingsTab({ tokenId, sharesBalance, listingPools }: any) {
    const session = useSession();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [filter, setFilter] = useState(3);

    console.log(listingPools);

    return (
        <Flex minH="25vh">
            <Box w="25%">
                <Select
                    fontSize="lg"
                    w="12rem"
                    h="3rem"
                    value={filter}
                    onChange={(e) => setFilter(parseInt(e.target.value))}
                    rounded="full"
                    variant="outline">
                    <option value={3}>Price: Lowest</option>
                    <option value={4}>Price: Highest</option>
                </Select>

                {sharesBalance > 0 &&
                    <Box>
                        <Button
                            w="12rem"
                            h="3rem"
                            mt="1rem"
                            colorScheme={"blue"}
                            rounded="full"
                            variant={"solid"}
                            onClick={onOpen}
                            fontSize="lg"
                        >
                            List your shares
                        </Button>
                        <CreateSharesListingPoolModal tokenId={tokenId} sharesBalance={sharesBalance} isOpen={isOpen} onClose={onClose} />
                    </Box>}
            </Box>

            <Box w="100%" border="1px solid rgb(0,0,0,0.0)" rounded="3xl">
                {listingPools.length > 0 ? <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th fontSize="lg">Price per share</Th>
                                <Th fontSize="lg">Amount</Th>
                                <Th fontSize="lg">Sold by</Th>
                                <Th fontSize="lg">Buy now</Th>
                            </Tr >
                        </Thead >
                        <Tbody fontSize="xl">
                            {listingPools.sort((a: SharesListingPool, b: SharesListingPool) => a.price - b.price).map((listingPool: SharesListingPool) =>
                                <Tr key={listingPool.sharesListingPoolId}>
                                    <Td>{(listingPool.price / 1e6).toLocaleString()}$</Td>
                                    <Td>{listingPool.amount.toLocaleString()}</Td>
                                    <Td>
                                        <Link href={`/profiles/${listingPool.seller}`}>{listingPool.seller == session?.data?.user?.address ? `You (${listingPool.seller.slice(2, 9)})` : listingPool.seller.slice(2, 9)}</Link>
                                    </Td>
                                    <Td>
                                        <Button>Buy</Button>
                                    </Td>
                                </Tr>)}
                        </Tbody>
                    </Table>
                </TableContainer> : <Text textAlign={"center"} fontSize="2xl">There aren&apos;t any active listings for this asset at the moment 🥸</Text>}
            </Box >
        </Flex >
    );
}