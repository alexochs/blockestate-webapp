import { marketContractAddress } from "@/helpers/contractAddresses";
import {
    Box,
    Center,
    SimpleGrid,
    Text,
    Link,
    Button,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/react";
import { useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import { AssetListing, SharesListing } from "@/helpers/types";
import { useState } from "react";
import { useRouter } from "next/router";
import BuySharesButton from "@/components/Buttons/BuySharesButton";
import DeleteSharesListingButton from "@/components/Buttons/DeleteSharesListingButton";
import { ethers } from "ethers";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    const listingId = context.params.listingId;

    // redirect if not authenticated
    if (!session || !listingId) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    // read listing data
    const listingData = (await readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "sharesListings",
        args: [listingId],
    })) as any;

    const listing = SharesListing.fromSingleEntry(listingData);
    const isSeller = listing.seller == session.user?.address;

    return {
        props: {
            user: session.user,
            listing: JSON.parse(JSON.stringify(listing)),
            isSeller,
        },
    };
}

export default function MarketPage({ user, listing, isSeller }: any) {
    const router = useRouter();
    const session = useSession();

    return (
        <Box>
            <Box minH="50vh">
                <Heading fontSize="8xl" pb="2rem">
                    Buy Shares
                </Heading>

                {listing ? (
                    <Box>
                        <Heading>BlockEstate Asset #{listing.tokenId}</Heading>

                        <Text fontSize="2xl">
                            {listing.amount} Shares for{" "}
                            {parseFloat(
                                ethers.utils.formatEther(
                                    listing.price.toString()
                                )
                            ).toFixed(2)}{" "}
                            MATIC
                        </Text>

                        <Text>Sold by {listing.seller}</Text>
                    </Box>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>Listings loaded but returned null!</Text>
                    </Center>
                )}

                <Center pt="4rem">
                    {!isSeller ? (
                        <BuySharesButton listing={listing} />
                    ) : (
                        <DeleteSharesListingButton listing={listing} />
                    )}
                </Center>
            </Box>
        </Box>
    );
}
