import { SharesListing } from "@/helpers/types";
import { Box, Button, Center, Flex, HStack, Link, Spacer, Text } from "@chakra-ui/react";
import PulseDot from 'react-pulse-dot';

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

                {sharesBalance > 0 &&
                    <Link href={"/rent/" + tokenId} style={{ textDecoration: "none" }}>
                        <Button rounded="full" variant="outline" size="lg" color="gray.600">
                            Shareholders Area
                        </Button>
                    </Link>}

                <Link href={"/rent/" + tokenId} style={{ textDecoration: "none" }}>
                    <Button rounded="full" variant="outline" size="lg" colorScheme="blue">
                        Rent this asset
                    </Button>
                </Link>
            </HStack>
        </Box>
    );
}