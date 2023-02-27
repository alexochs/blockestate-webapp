import {
    Box,
    Button,
    Center,
    Flex,
    GridItem,
    Heading,
    HStack,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import {
    assetsContractAddress,
    marketContractAddress,
    sharesContractAddress,
} from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import {
    Asset,
    AssetCategory,
    GroupInvestment,
    SharesListing,
} from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import DeleteAssetButton from "@/components/Buttons/DeleteAssetButton";
import ListingsCard from "@/components/ListingsCard";
import RentalsCard from "@/components/RentalsCard";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    const tokenId = context.params.tokenId;

    // redirect if not authenticated
    if (!session || !tokenId) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    // read asset
    const assetData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAsset",
        args: [tokenId],
    })) as any;

    const asset = Asset.fromSingleEntry(assetData);

    // read balance and total supply of shares
    const sharesBalanceData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOf",
        args: [session.user?.address, tokenId],
    })) as any;

    const sharesTotalSupplyData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "totalSupply",
        args: [tokenId],
    })) as any;

    const sharesBalance = parseInt(sharesBalanceData._hex, 16);
    const sharesTotalSupply = parseInt(sharesTotalSupplyData._hex, 16);

    // read if user is major shareholder
    const isMajorShareholderData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "ownerOf",
        args: [tokenId],
    })) as any;
    console.log(isMajorShareholderData);

    const isMajorShareholder = isMajorShareholderData === session.user?.address;

    // read listings of asset
    const listingsData = (await readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readListingsByAsset",
        args: [tokenId],
    })) as any;

    const listings = listingsData
        .map((listingData: any) => SharesListing.fromSingleEntry(listingData))
        .filter((listing: SharesListing) => listing.tokenId != 0);

    // read all group investments
    const groupInvestmentsData = (await readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readAllGroupInvestments",
    })) as any;

    const groupInvestments = groupInvestmentsData
        .map((groupInvestmentData: any) =>
            GroupInvestment.fromSingleEntry(groupInvestmentData)
        )
        .filter((groupInvestment: GroupInvestment) =>
            groupInvestment.investors.includes(session?.user?.address)
        );

    // return props to page
    return {
        props: {
            user: session.user,
            asset: JSON.parse(JSON.stringify(asset)),
            sharesBalance,
            sharesTotalSupply,
            isMajorShareholder,
            listings: JSON.parse(JSON.stringify(listings)),
            userGroupInvestments: JSON.parse(JSON.stringify(groupInvestments)),
        },
    };
}

export default function AssetsPage({
    user,
    asset,
    sharesBalance,
    sharesTotalSupply,
    isMajorShareholder,
    listings,
    userGroupInvestments,
}: any) {
    const session = useSession();
    const router = useRouter();
    const tokenId = asset.tokenId;

    return (
        <Flex>
            <Box w="65%">
                {!asset ? (
                    <Spinner size="xl" />
                ) : (
                    <VStack spacing="12rem" align={"start"}>
                        <Box>
                            <Heading fontSize="8xl">
                                {asset?.street + " " + asset?.number}
                            </Heading>
                            <Text fontSize="4xl">
                                {asset?.city + ", " + asset?.country}
                            </Text>
                        </Box>

                        <Box>
                            <Heading>
                                {
                                    AssetCategory[
                                        asset?.category as AssetCategory
                                    ]
                                }
                            </Heading>
                            {asset?.category == AssetCategory.APARTMENT && (
                                <Text>Nr. {asset?.apNumber}</Text>
                            )}
                        </Box>

                        <Text fontSize="sm" color="gray.400">
                            BlockEstate: #{asset?.tokenId}
                        </Text>
                    </VStack>
                )}
            </Box>

            <Center w="35%" position="sticky" top={"20vh"} flexDir="column">
                <ListingsCard
                    tokenId={tokenId}
                    sharesBalance={sharesBalance}
                    sharesTotalSupply={sharesTotalSupply}
                    listings={listings}
                    userGroupInvestments={userGroupInvestments}
                />

                <Box py="1rem" />

                <RentalsCard tokenId={tokenId} />
            </Center>
        </Flex>
    );
}
