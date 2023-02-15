import { SharesListing } from "@/helpers/types";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { ethers } from "ethers";

export default function ListingPreview({ listing }: any) {
    const _listing = listing as SharesListing;

    return (
        <Link
            href={"/market/buy?listingId=" + _listing.listingId}
            style={{ textDecoration: "none" }}
        >
            <Box
                border="1px solid gray"
                rounded="3xl"
                p="1rem"
                textDecor="none"
            >
                <Heading fontSize="4xl">{"Asset #" + _listing.tokenId}</Heading>

                <Text fontSize="2xl">{_listing.amount + " Shares"}</Text>

                <Text fontSize="2xl">
                    {parseFloat(
                        ethers.utils.formatEther(_listing.price.toString())
                    ).toFixed(2) + " MATIC"}
                </Text>

                <Text pt="1rem" fontSize="xs" color="gray.400">
                    {"Listing #" + _listing.listingId}
                </Text>
            </Box>
        </Link>
    );
}
