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
import { useSession } from "next-auth/react";
import { useContractRead } from "wagmi";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import { AssetListing, SharesListing } from "@/helpers/types";
import { useState } from "react";
import ListingPreview from "@/components/ListingPreview";

export default function MarketPage() {
    const session = useSession();

    const [userListings, setUserListings] = useState<SharesListing[]>([]);
    const [sharesListings, setSharesListings] = useState<SharesListing[]>([]);

    const readListingsByAccount = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readListingsByAccount",
        args: [session?.data?.user?.address],
        onError: (error) => {
            console.log("readListingsByAccount() => ", error);
        },
        onSuccess: (data: Object[]) => {
            let shareListings = [];

            for (let i = 0; i < data.length; i++) {
                shareListings.push(SharesListing.fromSingleEntry(data[i]));
            }

            setUserListings(
                shareListings.filter((shareListing) => shareListing.tokenId > 0)
            );
        },
    });

    const readAllSharesListings = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readAllSharesListings",
        args: [],
        onError: (error) => {
            console.log("readAllSharesListings() => ", error);
        },
        onSuccess: (data: Object[]) => {
            let shareListings = [];

            for (let i = 0; i < data.length; i++) {
                shareListings.push(SharesListing.fromSingleEntry(data[i]));
            }

            setSharesListings(
                shareListings.filter((shareListing) => shareListing.tokenId > 0)
            );
        },
    });

    return (
        <Box>
            <Box minH="50vh">
                <Heading fontSize="8xl" pb="2rem">
                    Your Listings
                </Heading>

                {readListingsByAccount.isError ? (
                    <Text color="red">Error!</Text>
                ) : readListingsByAccount.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : userListings && userListings.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {userListings.map((sharesListing) => (
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

                {readAllSharesListings.isError ? (
                    <Text color="red">Error!</Text>
                ) : readAllSharesListings.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : sharesListings && sharesListings.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {sharesListings.map((sharesListing) => (
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
