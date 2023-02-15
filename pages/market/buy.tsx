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
import DeleteSharesListingButton from "@/components/Buttons/DeleteSharesListingButton";
import { ethers } from "ethers";

export default function MarketPage() {
    const router = useRouter();
    const session = useSession();

    const { listingId } = router.query;

    const [listing, setListing] = useState<SharesListing | null>(null);
    const [isSeller, setIsSeller] = useState<boolean>(false);

    const getListing = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "sharesListings",
        args: [listingId],
        onError: (error) => {
            console.log("getListing() => ", error);
        },
        onSuccess: (data: Object) => {
            const listing = SharesListing.fromSingleEntry(data);
            setListing(listing);
            setIsSeller(listing.seller == session?.data?.user?.address);
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
                        <BuySharesButton
                            listingId={listingId}
                            price={listing ? listing.price : 0}
                        />
                    ) : (
                        <DeleteSharesListingButton listingId={listingId} />
                    )}
                </Center>
            </Box>
        </Box>
    );
}
