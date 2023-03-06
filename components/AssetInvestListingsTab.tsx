import { SharesListing } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Link, Select, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';
import BuySharesButton from "./Buttons/BuySharesButton";
import CreateSharesListingButton from "./Buttons/CreateSharesListingButton";
import ListSharesModal from "./Modals/ListSharesModal";

export default function AssetInvestListingsTab({ tokenId, sharesBalance, listings }: any) {
    const session = useSession();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [filter, setFilter] = useState(3);

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
                            variant={"outline"}
                            onClick={onOpen}
                            fontSize="lg"
                        >
                            List your shares
                        </Button>
                        <ListSharesModal tokenId={tokenId} sharesBalance={sharesBalance} isOpen={isOpen} onClose={onClose} />
                    </Box>}
            </Box>

            <Box w="100%" border="1px solid rgb(0,0,0,0.0)" rounded="3xl">
                {listings.length > 0 ? <TableContainer>
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
                            {listings.sort((a: SharesListing, b: SharesListing) => (a.price / a.amount) - (b.price / b.amount)).map((listing: SharesListing) =>
                                <Tr key={listing.listingId}>
                                    <Td>{(listing.price / listing.amount / 10 ** 6).toLocaleString()}$</Td>
                                    <Td>{listing.amount.toLocaleString()}</Td>
                                    <Td>
                                        <Link href={`/profiles/${listing.seller}`}>{listing.seller == session?.data?.user?.address ? `You (${listing.seller.slice(2, 9)})` : listing.seller.slice(2, 9)}</Link>
                                    </Td>
                                    <Td>
                                        <BuySharesButton listing={listing} />
                                    </Td>
                                </Tr>)}
                        </Tbody>
                    </Table>
                </TableContainer> : <Text textAlign={"center"} fontSize="2xl">There aren&apos;t any active listings for this asset at the moment 🥸</Text>}
            </Box >
        </Flex >
    );
}