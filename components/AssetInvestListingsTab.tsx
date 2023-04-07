import { SharesListing, SharesListingPool } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Link, Select, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';
import CreateSharesListingPoolModal from "./Modals/CreateSharesListingPoolModal";
import PurchaseSharesListingPoolModal from "./Modals/PurchaseSharesListingPoolModal";
import UpdateSharesListingPoolModal from "./Modals/UpdateSharesListingPoolModal";

export default function AssetInvestListingsTab({ tokenId, sharesBalance, listingPools }: any) {
    const session = useSession();

    const { isOpen: listModalIsOpen, onOpen: listModalOnOpen, onClose: listModalOnClose } = useDisclosure();
    const { isOpen: updateModalIsOpen, onOpen: updateModalOnOpen, onClose: updateModalOnClose } = useDisclosure();
    const { isOpen: purchaseModalIsOpen, onOpen: purchaseModalOnOpen, onClose: purchaseModalOnClose } = useDisclosure();

    const [filter, setFilter] = useState(3);
    const [selectedListingPool, setSelectedListingPool] = useState<SharesListingPool>();

    return (
        <Flex minH="25vh" w="100%">
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
                            onClick={listModalOnOpen}
                            fontSize="lg"
                        >
                            List your shares
                        </Button>
                        <CreateSharesListingPoolModal tokenId={tokenId} sharesBalance={sharesBalance} isOpen={listModalIsOpen} onClose={listModalOnClose} />
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
                                    <Td fontWeight={"bold"}>{(listingPool.price / 1e6).toLocaleString()}$</Td>
                                    <Td fontWeight={"bold"}>{listingPool.amount.toLocaleString()}</Td>
                                    <Td>
                                        <Link color="blue.500" href={`/profiles/${listingPool.seller}`} target="_blank">{listingPool.seller == session?.data?.user?.address ? `${listingPool.seller.slice(2, 8)} (You)` : listingPool.seller.slice(2, 8)}</Link>
                                    </Td>
                                    <Td>
                                        {listingPool.seller == session?.data?.user?.address ?
                                            <Box>
                                                <Button
                                                    onClick={updateModalOnOpen}
                                                    rounded="full"
                                                    variant="ghost"
                                                    size="lg"
                                                    w="8rem"
                                                >
                                                    Update
                                                </Button>
                                                <UpdateSharesListingPoolModal sharesListingPoolId={listingPool.sharesListingPoolId} isOpen={updateModalIsOpen} onClose={updateModalOnClose} />
                                            </Box> :
                                            <Box>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedListingPool(listingPool);
                                                        purchaseModalOnOpen();
                                                    }}
                                                    rounded="full"
                                                    size="lg"
                                                    colorScheme="blue"
                                                    w="8rem"
                                                >
                                                    Buy
                                                </Button>
                                                <PurchaseSharesListingPoolModal sharesListingPool={selectedListingPool} isOpen={purchaseModalIsOpen} onClose={purchaseModalOnClose} />
                                            </Box>}
                                    </Td>
                                </Tr>)}
                        </Tbody>
                    </Table>
                </TableContainer> : <Text textAlign={"center"} fontSize="2xl">There aren&apos;t any active listings for this asset at the moment 🥸</Text>}
            </Box >
        </Flex >
    );
}