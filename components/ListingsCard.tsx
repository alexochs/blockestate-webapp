import { SharesListing } from "@/helpers/types";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Box,
    Stack,
    Spacer,
    Flex,
    Text,
    Input,
    Button,
    IconButton,
    HStack,
    Center,
    Divider,
    Link,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import ListSharesModal from "./ListSharesModal";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";
import DeleteSharesListingButton from "./Buttons/DeleteSharesListingButton";
import BuySharesButton from "./Buttons/BuySharesButton";

export default function ListingsCard({
    tokenId,
    sharesBalance,
    sharesTotalSupply,
    listings,
}: any) {
    const session = useSession();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box
            mx="1rem"
            p="1.5rem"
            rounded={"3xl"}
            border={"1px solid rgb(100, 100, 100)"}
            bgGradient="linear(to-br, rgb(255, 255, 255, 0.2), rgb(255, 255, 255, 0.1))"
            backdropFilter={"blur(0.25rem)"}
            position="sticky"
            top={"20vh"}
        >
            <Stack spacing={"1rem"}>
                <Text>
                    You own {sharesBalance} out of {sharesTotalSupply} (
                    {((sharesBalance / sharesTotalSupply) * 100).toFixed(2)}%)
                    Share
                    {sharesTotalSupply > 1 ? "s" : ""}.
                </Text>

                <Divider />

                <VStack spacing="1rem">
                    <Flex>
                        <HStack spacing="1rem">
                            <Text fontWeight="bold" fontSize="2xl">
                                Listings
                            </Text>

                            <Button
                                fontSize="sm"
                                size="sm"
                                colorScheme={"blue"}
                                variant="ghost"
                                rounded="2xl"
                                onClick={onOpen}
                            >
                                Sell your Shares
                            </Button>
                        </HStack>
                    </Flex>

                    <VStack spacing="1rem">
                        {listings.length < 1 ? (
                            <Text>
                                There are currently no active listings for this
                                asset!
                            </Text>
                        ) : (
                            listings.map((listing: SharesListing) => (
                                <HStack
                                    key={listing.listingId}
                                    spacing="1rem"
                                    w="100%"
                                    align="start"
                                >
                                    <Box>
                                        <Text fontSize="lg">
                                            {listing.amount} Share
                                            {listing.amount > 1
                                                ? "s"
                                                : ""} @{" "}
                                            {(
                                                listing.price /
                                                10 ** 18 /
                                                listing.amount
                                            )
                                                .toFixed(2)
                                                .toString()}{" "}
                                            MATIC
                                        </Text>

                                        <Text fontSize="xs">
                                            {(listing.price / 10 ** 18).toFixed(
                                                2
                                            )}{" "}
                                            MATIC
                                        </Text>
                                    </Box>

                                    {listing.seller ===
                                    session?.data?.user?.address ? (
                                        <DeleteSharesListingButton
                                            listing={listing}
                                        />
                                    ) : (
                                        <BuySharesButton listing={listing} />
                                    )}
                                </HStack>
                            ))
                        )}
                    </VStack>
                </VStack>
            </Stack>

            <ListSharesModal
                tokenId={tokenId}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
}
