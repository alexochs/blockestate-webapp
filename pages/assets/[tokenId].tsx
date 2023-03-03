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
    Image,
    Stack,
} from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import {
    assetsContractAddress,
    marketContractAddress,
    sharesContractAddress,
    rentalsContractAddress,
} from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import {
    Asset,
    AssetCategory,
    FixedRental,
    GroupInvestment,
    MonthlyRental,
    SharesListing,
} from "@/helpers/types";
import AssetPreview from "@/components/AssetPreviewCard";
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

    // read rentable and price per day of asset
    const isRentable = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isRentable",
        args: [tokenId],
    })) as any;

    const isMonthlyRentable = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isMonthlyRentable",
        args: [tokenId],
    })) as any;

    const pricePerDayData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerDay",
        args: [tokenId],
    })) as any;
    const pricePerDay = parseInt(pricePerDayData._hex, 16);

    const pricePerMonthData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerMonth",
        args: [tokenId],
    })) as any;
    const pricePerMonth = parseInt(pricePerMonthData._hex, 16);

    // read rentals of asset
    const fixedRentalsData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "readFixedRentalsByToken",
        args: [tokenId],
    })) as any;
    const fixedRentals = fixedRentalsData.map((entry: any) => new FixedRental(entry));

    const monthlyRentalsData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "readMonthlyRentalsByToken",
        args: [tokenId],
    })) as any;
    const monthlyRentals = monthlyRentalsData.map((entry: any) => new MonthlyRental(entry));

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
            fixedRentals: JSON.parse(JSON.stringify(fixedRentals)),
            isRentable,
            pricePerDay,
            monthlyRentals: JSON.parse(JSON.stringify(monthlyRentals)),
            isMonthlyRentable,
            pricePerMonth,
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
    fixedRentals,
    isRentable,
    pricePerDay,
    monthlyRentals,
    isMonthlyRentable,
    pricePerMonth,
}: any) {
    const session = useSession();
    const router = useRouter();
    const tokenId = asset.tokenId;

    return (
        <Box>
            <Flex>
                <Image
                    src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/0cf46569-a5cd-4aa0-bbbd-156162c84e7e.jpeg"
                    fit="cover"
                    h="60vh"
                    w="50%"
                    roundedLeft="3xl"
                    pr=".25rem"
                />

                <Flex flexDir="column" px=".25rem" w="25%">
                    <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/e5596519-efcf-4a65-bd12-3191ebd33ee6.jpeg" fit="cover" h="30vh" pb=".5rem" />
                    <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/a4a94c93-df0c-45db-90fe-2ee46654df8d.jpeg" fit="cover" h="30vh" />
                </Flex>

                <Flex flexDir="column" pl=".25rem" w="25%">
                    <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/6c5c0a5e-ea60-417d-8c1c-cdcdaa0d0c21.jpeg?im_w=720" fit="cover" h="30vh" pb=".5rem" roundedRight={"3xl"} />
                    <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/44777246-61ff-408c-be6d-f1c9262e340e.jpeg?im_w=720" fit="cover" h="30vh" roundedRight={"3xl"} />
                </Flex>
            </Flex>

            <Box>
                <Heading fontSize="8xl">
                    {asset?.street + " " + asset?.number}
                </Heading>

                <Text fontSize="5xl" color="gray.600">
                    {asset?.city + ", " + asset?.country}
                </Text>

                {asset?.category == AssetCategory.APARTMENT && (
                    <Text fontSize="2xl" color="gray.500">Apartment {asset?.apNumber}</Text>
                )}
            </Box>
        </Box >
    );
}
