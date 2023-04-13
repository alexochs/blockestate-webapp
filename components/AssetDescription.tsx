import { assetsContractAddress, sharesContractAddress } from "@/helpers/contractAddresses";
import { SharesListing, SharesListingPool } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Icon, Link, SimpleGrid, Spacer, Stack, Text, useMediaQuery } from "@chakra-ui/react";
import PulseDot from 'react-pulse-dot';
import { SiEthereum, SiOpensea, SiPoly, SiRarible } from "react-icons/si";
import 'react-pulse-dot/dist/index.css';

export default function AssetDescription({ tokenId, sharesBalance, sharesTotalSupply, shareholders, listingPools }: any) {
    const isMobile = useMediaQuery("(max-width: 768px)")[0];
    const floorListingPool = listingPools.sort((a: SharesListingPool, b: SharesListingPool) => a.price - b.price)[0];

    return (
        <Box pt="2rem">
            {!isMobile ? <HStack spacing="2rem">
                <Box>
                    <Text fontWeight={"bold"} fontSize="3xl">{sharesTotalSupply.toLocaleString()}</Text>
                    <Text mt="-.5rem" color="gray.600">Total Shares</Text>
                </Box>

                <Box>
                    <Text fontWeight={"bold"} fontSize="3xl">{shareholders.length.toLocaleString()}</Text>
                    <Text mt="-.5rem" color="gray.600">Shareholder{shareholders.length > 1 ? "s" : ""}</Text>
                </Box>

                <Box>
                    <Text fontWeight={"bold"} fontSize="3xl">{floorListingPool ? (floorListingPool.price / 10 ** 6).toLocaleString() + "$" : "N/A"}</Text>
                    <Text mt="-.5rem" color="gray.600">Floor Price</Text>
                </Box>

                <Flex>
                    <PulseDot color="#3182CE" />
                    <Center>
                        <Text fontWeight="bold" fontSize="xl">Live On-Chain</Text>
                    </Center>
                </Flex>

                <Spacer />

                <Link href={`https://testnets.opensea.io/assets/mumbai/${sharesContractAddress}/${tokenId}`} target="_blank">
                    <Icon as={SiOpensea} w={"3rem"} h={"3rem"} p=".25rem" rounded="full" border="1px solid black" _hover={{ background: "gray.200" }} />
                </Link>

                <Link href={`https://testnet.rarible.com/collection/polygon/${sharesContractAddress}/items`} target="_blank">
                    <Icon as={SiRarible} w={"3rem"} h={"3rem"} p=".25rem" rounded="full" border="1px solid black" _hover={{ background: "gray.200" }} />
                </Link>
            </HStack> :
                <Stack w="100%" spacing="1rem">
                    <SimpleGrid w="100%" columns={[2]} gap="1rem">
                        <Box>
                            <Text fontWeight={"bold"} fontSize="3xl">{sharesTotalSupply.toLocaleString()}</Text>
                            <Text mt="-.5rem" color="gray.600">Total Shares</Text>
                        </Box>

                        <Box>
                            <Text fontWeight={"bold"} fontSize="3xl">{shareholders.length.toLocaleString()}</Text>
                            <Text mt="-.5rem" color="gray.600">Shareholder{shareholders.length > 1 ? "s" : ""}</Text>
                        </Box>

                        <Box>
                            <Text fontWeight={"bold"} fontSize="3xl">{floorListingPool ? (floorListingPool.price / 10 ** 6).toLocaleString() + "$" : "N/A"}</Text>
                            <Text mt="-.5rem" color="gray.600">Floor Price</Text>
                        </Box>
                    </SimpleGrid>

                    <Flex w="100%">
                        <Center>
                            <PulseDot color="#3182CE" />
                            <Center>
                                <Text fontWeight="bold" fontSize="xl">Live On-Chain</Text>
                            </Center>
                        </Center>

                        <Spacer />

                        <Link href={`https://testnets.opensea.io/assets/mumbai/${sharesContractAddress}/${tokenId}`} target="_blank">
                            <Icon as={SiOpensea} w={"3rem"} h={"3rem"} p=".25rem" rounded="full" border="1px solid black" _hover={{ background: "gray.200" }} />
                        </Link>

                        <Link ml="1rem" href={`https://testnet.rarible.com/collection/polygon/${sharesContractAddress}/items`} target="_blank">
                            <Icon as={SiRarible} w={"3rem"} h={"3rem"} p=".25rem" rounded="full" border="1px solid black" _hover={{ background: "gray.200" }} />
                        </Link>
                    </Flex>
                </Stack>}
        </Box>
    );
}