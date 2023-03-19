import { SharesListing } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Input, Link, Select, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';
import BuySharesButton from "./Buttons/BuySharesButton";
import CreateSharesListingButton from "./Buttons/CreateSharesListingButton";
import ListSharesModal from "./Modals/ListSharesModal";

export default function AssetInvestShareholdersTab({ shareholderInfos, sharesTotalSupply }: any) {
    const session = useSession();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [filter, setFilter] = useState(1);
    const [search, setSearch] = useState('')
    const handleSearchChange = (event: any) => {
        const _search = event.target.value;

        setSearch(_search);
    }

    return (
        <Flex minH="25vh">
            <Box w="25%">
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
                    value={filter}
                    onChange={(e) => setFilter(parseInt(e.target.value))}
                    rounded="full"
                    variant="outline">
                    <option value={1}>Shares: Highest</option>
                    <option value={2}>Shares: Lowest</option>
                </Select>
            </Box>

            <Box w="100%" border="1px solid rgb(0,0,0,0.0)" rounded="3xl">
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th fontSize="lg">Address</Th>
                                <Th fontSize="lg">Shares</Th>
                            </Tr >
                        </Thead >
                        <Tbody fontSize="xl">
                            {shareholderInfos
                                .filter((info: any) => info.address.includes(search))
                                .sort((a: any, b: any) => filter === 1 ? b.balance - a.balance : a.balance - b.balance)
                                .map((shareholderInfo: any) =>
                                    <Tr key={shareholderInfo.address}>
                                        <Td>
                                            <Link color="blue.500" href={`/profiles/${shareholderInfo.address}`} target="_blank">
                                                {shareholderInfo.address === session?.data?.user?.address ?
                                                    `${shareholderInfo.address.slice(2, 8)} (You)` :
                                                    shareholderInfo.address.slice(2, 8)}
                                            </Link>
                                        </Td>
                                        <Td>
                                            <Text fontWeight="bold">
                                                {shareholderInfo.balance.toLocaleString()} ({((shareholderInfo.balance / sharesTotalSupply) * 100).toFixed(2)}%)
                                            </Text>
                                        </Td>
                                    </Tr>)}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box >
        </Flex >
    );
}