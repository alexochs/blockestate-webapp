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
import { useRouter } from "next/router";
import BuySharesButton from "@/components/Buttons/BuySharesButton";

export default function MarketPage() {
    const router = useRouter();
    const session = useSession();

    const { listingId } = router.query;

    const [listing, setListing] = useState<SharesListing | null>(null);

    const getListing = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "sharesListings",
        args: [listingId],
        onError: (error) => {
            console.log("getListing() => ", error);
        },
        onSuccess: (data: Object) => {
            setListing(SharesListing.fromSingleEntry(data));
        },
    });

    return (
        <Box>
            <Box minH="50vh">
                <Heading fontSize="8xl" pb="2rem">
                    Buy Shares
                </Heading>

                {getListing.isError ? (
                    <Text color="red">Error!</Text>
                ) : getListing.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : listing ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        <Text>{JSON.stringify(listing)}</Text>
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>Listings loaded but returned null!</Text>
                    </Center>
                )}

                <Center>
                    <BuySharesButton
                        listingId={listingId}
                        price={listing ? listing.price : 0}
                    />
                </Center>
            </Box>
        </Box>
    );
}
