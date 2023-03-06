import { GroupInvestment, SharesListing } from "@/helpers/types";
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
import ListSharesModal from "./Modals/ListSharesModal";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";
import DeleteSharesListingButton from "./Buttons/DeleteSharesListingButton";
import BuySharesButton from "./Buttons/BuySharesButton";
import CreateGroupInvestmentButton from "./Buttons/CreateGroupInvestmentButton";
import CreateGroupInvestmentModal from "./Modals/CreateGroupInvestmentModal";
import ViewGroupInvestmentModal from "./Modals/ViewGroupInvestmentModal";

export default function ListingsCard({
    tokenId,
    sharesBalance,
    sharesTotalSupply,
    listings,
    userGroupInvestments,
}: any) {
    const session = useSession();

    const {
        isOpen: listSharesModalIsOpen,
        onOpen: listSharesModalOnOpen,
        onClose: listSharesModalOnClose,
    } = useDisclosure();

    const {
        isOpen: createGroupInvestmentModalIsOpen,
        onOpen: createGroupInvestmentModalOnOpen,
        onClose: createGroupInvestmentModalOnClose,
    } = useDisclosure();

    const {
        isOpen: viewGroupInvestmentModalIsOpen,
        onOpen: viewGroupInvestmentModalOnOpen,
        onClose: viewGroupInvestmentModalOnClose,
    } = useDisclosure();

    const [selectedListing, setSelectedListing] =
        useState<SharesListing | null>();

    const [selectedGroupInvestment, setSelectedGroupInvestment] =
        useState<GroupInvestment | null>();

    const usdDecimal = 10 ** 6;

    return (
        <Box
            rounded={"3xl"}
            border={"1px solid rgb(100, 100, 100)"}
            bgGradient="linear(to-br, rgb(255, 255, 255, 0.2), rgb(255, 255, 255, 0.1))"
            backdropFilter={"blur(0.25rem)"}
            mx="1rem"
            p="1.5rem"
            w="24rem"
        >
            <Stack spacing={"1rem"}>
                <Text>
                    You hold {sharesBalance} out of {sharesTotalSupply} (
                    {((sharesBalance / sharesTotalSupply) * 100).toFixed(2)}%)
                    Share
                    {sharesTotalSupply > 1 ? "s" : ""}.
                </Text>

                <Divider />

                <Stack spacing="1rem">
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
                                rounded="full"
                                onClick={listSharesModalOnOpen}
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
                                <Box key={listing.listingId} w="100%">
                                    <Text fontSize="lg" fontWeight="bold">
                                        {listing.amount} Share
                                        {listing.amount > 1 ? "s" : ""} @{" "}
                                        {(
                                            listing.price /
                                            usdDecimal /
                                            listing.amount
                                        ).toLocaleString()}{" "}
                                        USDC
                                    </Text>

                                    <Box>
                                        <Text fontSize="sm">
                                            {(
                                                listing.price / usdDecimal
                                            ).toLocaleString()}{" "}
                                            USDC
                                        </Text>

                                        <Text fontSize="xs">
                                            Sold by {listing.seller.slice(0, 6)}
                                            ...{listing.seller.slice(-4)}
                                        </Text>
                                    </Box>
                                    {listing.seller ===
                                        session?.data?.user?.address ? (
                                        <DeleteSharesListingButton
                                            listing={listing}
                                        />
                                    ) : (
                                        <HStack pt=".5rem">
                                            <BuySharesButton
                                                listing={listing}
                                            />

                                            {userGroupInvestments.filter(
                                                (gi: any) =>
                                                    gi.listingId ===
                                                    listing.listingId
                                            ).length < 1 ? (
                                                <Button
                                                    rounded="full"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedListing(
                                                            listing
                                                        );
                                                        createGroupInvestmentModalOnOpen();
                                                    }}
                                                >
                                                    Create Group Investment
                                                </Button>
                                            ) : (
                                                <Button
                                                    rounded="full"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedListing(
                                                            listing
                                                        );

                                                        setSelectedGroupInvestment(
                                                            userGroupInvestments.filter(
                                                                (gi: any) =>
                                                                    gi.listingId ===
                                                                    listing.listingId
                                                            )[0]
                                                        );

                                                        viewGroupInvestmentModalOnOpen();
                                                    }}
                                                >
                                                    View Group Investment
                                                </Button>
                                            )}
                                        </HStack>
                                    )}
                                </Box>
                            ))
                        )}
                    </VStack>
                </Stack>
            </Stack>

            <ListSharesModal
                tokenId={tokenId}
                isOpen={listSharesModalIsOpen}
                onClose={listSharesModalOnClose}
            />

            <CreateGroupInvestmentModal
                listing={selectedListing}
                selectedListing={selectedListing}
                isOpen={createGroupInvestmentModalIsOpen}
                onClose={createGroupInvestmentModalOnClose}
            />

            <ViewGroupInvestmentModal
                listing={selectedListing}
                groupInvestment={selectedGroupInvestment}
                isOpen={viewGroupInvestmentModalIsOpen}
                onClose={viewGroupInvestmentModalOnClose}
            />
        </Box>
    );
}
