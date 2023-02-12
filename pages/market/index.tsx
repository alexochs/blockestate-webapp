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

export default function MarketPage() {
    const session = useSession();

    const [userListings, setUserListings] = useState<SharesListing[]>([]);
    giconst[(assetListings, setAssetListings)] = useState<AssetListing[]>([]);
    const [sharesListings, setSharesListings] = useState<SharesListing[]>([]);

    const readAllAssetListings = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readAllAssetListings",
        onError: (error) => {
            console.log("readAllAssetListings() => ", error);
        },
        onSuccess: (data: Object[]) => {
            let assetListings = [];

            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                assetListings.push(AssetListing.fromSingleEntry(data[i]));
            }

            console.log(assetListings);

            setAssetListings(
                assetListings.filter((assetListing) => assetListing.tokenId > 0)
            );
        },
    });

    const readListingsByAccount = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readListingsByAccount",
        onError: (error) => {
            console.log("readListingsByAccount() => ", error);
        },
        onSuccess: (data: Object[]) => {
            let shareListings = [];

            for (let i = 0; i < data.length; i++) {
                console.log(data[i]);
                shareListings.push(SharesListing.fromSingleEntry(data[i]));
            }

            console.log(shareListings);

            setUserListings(
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

                <Box pb="2rem">
                    <Link
                        href="/market/list"
                        style={{ textDecoration: "none" }}
                    >
                        <Button
                            rounded="xl"
                            colorScheme="blue"
                            size="lg"
                            border="1px solid black"
                        >
                            List your Shares
                        </Button>
                    </Link>
                </Box>

                {readListingsByAccount.isError ? (
                    <Text color="red">Error!</Text>
                ) : readListingsByAccount.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : sharesListings && sharesListings.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {sharesListings.map((sharesListing) => (
                            <Text>{JSON.stringify(sharesListing)}</Text>
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

                {readAllAssetListings.isError ? (
                    <Text color="red">Error!</Text>
                ) : readAllAssetListings.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : assetListings && assetListings.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {assetListings.map((assetListing) => (
                            <Text>{JSON.stringify(assetListing)}</Text>
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
