import { assetsContractAddress } from "@/helpers/contractAddresses";
import { SharesListing } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Icon, Link, Spacer, Text } from "@chakra-ui/react";
import PulseDot from 'react-pulse-dot';
import { SiOpensea, SiRarible } from "react-icons/si";

export default function AssetDescription({ tokenId, sharesBalance, sharesTotalSupply, shareholders, listings }: any) {
    const floorListing = listings.sort((a: SharesListing, b: SharesListing) => (a.price / a.amount) - (b.price / b.amount))[0];

    return (
        <Box pt="2rem">
            <HStack spacing="2rem">
                <Box>
                    <Text fontWeight={"bold"} fontSize="3xl">{sharesTotalSupply.toLocaleString()}</Text>
                    <Text mt="-.5rem" color="gray.600">Total Shares</Text>
                </Box>

                <Box>
                    <Text fontWeight={"bold"} fontSize="3xl">{shareholders.length.toLocaleString()}</Text>
                    <Text mt="-.5rem" color="gray.600">Shareholder{shareholders.length > 1 ? "s" : ""}</Text>
                </Box>

                <Box>
                    <Text fontWeight={"bold"} fontSize="3xl">{floorListing ? (floorListing.price / floorListing.amount / 10 ** 6).toLocaleString() + "$" : "N/A"}</Text>
                    <Text mt="-.5rem" color="gray.600">Floor Price</Text>
                </Box>

                <Flex>
                    <PulseDot color="#3182CE" />
                    <Center>
                        <Text fontWeight="bold" fontSize="xl">Live On-Chain</Text>
                    </Center>
                </Flex>

                <Spacer />

                <Link href={`https://testnets.opensea.io/assets/mumbai/${assetsContractAddress}/${tokenId}`} target="_blank">
                    <Icon as={SiOpensea} w={"3rem"} h={"3rem"} p=".25rem" rounded="full" border="1px solid black" _hover={{ background: "gray.200" }} />
                </Link>

                <Link href={`https://testnet.rarible.com/collection/polygon/${assetsContractAddress}/${tokenId}`} target="_blank">
                    <Icon as={SiRarible} w={"3rem"} h={"3rem"} p=".25rem" rounded="full" border="1px solid black" _hover={{ background: "gray.200" }} />
                </Link>
            </HStack>
        </Box>
    );
}