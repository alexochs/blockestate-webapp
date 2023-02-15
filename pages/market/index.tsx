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
import ListingPreview from "@/components/ListingPreview";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    // read all listings
    const allListingsData = (await readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readAllSharesListings",
        args: [],
    })) as any;

    const allListings = allListingsData
        .map((listingData: any) => SharesListing.fromSingleEntry(listingData))
        .filter((listing: SharesListing) => listing.tokenId > 0);

    return {
        props: {
            user: session.user,
            allListings: JSON.parse(JSON.stringify(allListings)),
        },
    };
}

export default function MarketPage({ user, allListings }: any) {
    const session = useSession();
    const userListings = allListings.filter(
        (listing: SharesListing) => listing.seller === user.address
    );

    return (
        <Box>
            <Box minH="50vh">
                <Heading fontSize="8xl" pb="2rem">
                    Your Listings
                </Heading>

                {userListings && userListings.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {userListings.map((sharesListing: SharesListing) => (
                            <ListingPreview listing={sharesListing} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>You do not have any active listings.</Text>
                        <Link href="/assets">
                            <Text fontWeight={"bold"}>List an Asset now!</Text>
                        </Link>
                    </Center>
                )}
            </Box>

            <Box minH="50vh">
                <Heading fontSize="8xl" pb="2rem">
                    Explore Listings
                </Heading>

                {allListings && allListings.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {allListings.map((sharesListing: SharesListing) => (
                            <ListingPreview listing={sharesListing} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>There are not Assets listed at the moment.</Text>
                    </Center>
                )}
            </Box>
        </Box>
    );
}
