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
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Icon,
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
import AssetHeader from "@/components/AssetHeader";
import AssetDescription from "@/components/AssetDescription";
import AssetInvestTabs from "@/components/AssetInvestTabs";
import AssetHeaderImages from "@/components/AssetHeaderImages";
import { BiArea } from "react-icons/bi";
import { FaBed, FaDoorOpen } from "react-icons/fa";
import RentalsFloatingActionCard from "@/components/RentalsFloatingActionCard";

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
    const shareholders = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readShareholdersByToken",
        args: [tokenId],
    })) as any;

    const shareholderInfos = [];
    for (let i = 0; i < shareholders.length; i++) {
        const shareholder = shareholders[i];

        const sharesBalanceData = (await readContract({
            address: sharesContractAddress,
            abi: sharesAbi,
            functionName: "balanceOf",
            args: [shareholder, tokenId],
        })) as any;

        const sharesBalance = parseInt(sharesBalanceData._hex, 16);

        shareholderInfos.push({
            address: shareholder,
            balance: sharesBalance,
        });
    }
    console.log(shareholderInfos);

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
            shareholders,
            listings: JSON.parse(JSON.stringify(listings)),
            userGroupInvestments: JSON.parse(JSON.stringify(groupInvestments)),
            fixedRentals: JSON.parse(JSON.stringify(fixedRentals)),
            isRentable,
            pricePerDay,
            monthlyRentals: JSON.parse(JSON.stringify(monthlyRentals)),
            isMonthlyRentable,
            pricePerMonth,
            shareholderInfos,
        },
    };
}

export default function RentAssetPage({
    user,
    asset,
    sharesBalance,
    sharesTotalSupply,
    shareholders,
    listings,
    userGroupInvestments,
    fixedRentals,
    isRentable,
    pricePerDay,
    monthlyRentals,
    isMonthlyRentable,
    pricePerMonth,
    shareholderInfos
}: {
    user: any;
    asset: Asset;
    sharesBalance: number;
    sharesTotalSupply: number;
    shareholders: string[];
    listings: SharesListing[];
    userGroupInvestments: GroupInvestment[];
    fixedRentals: FixedRental[];
    isRentable: boolean;
    pricePerDay: number;
    monthlyRentals: MonthlyRental[];
    isMonthlyRentable: boolean;
    pricePerMonth: number;
    shareholderInfos: any[]
}) {
    const session = useSession();
    const router = useRouter();
    const tokenId = asset.tokenId;

    return (
        <Box>
            <AssetHeaderImages />

            <Flex>
                <Box w="70%" pr="1rem">
                    <Box pt="1rem">
                        <Heading fontSize="6xl">{asset.city}, {asset.country}</Heading>
                        <Text fontSize="4xl" color="gray.600">{asset.street} {asset.number}, {asset.zip}</Text>
                        {asset.category == 0 && <Text fontSize="4xl" color="gray.600">Apartment {asset.apNumber}</Text>}
                    </Box>

                    <Box pt="2rem">
                        <HStack spacing="2rem">
                            <Center border="1px solid rgb(0,0,0,0.2)" rounded="3xl" px="1rem" py=".5rem">
                                <Icon as={BiArea} w={"4rem"} h={"4rem"} />
                                <Box pl="1rem">
                                    <Text fontWeight={"bold"} fontSize="3xl">{(187).toLocaleString()}</Text>
                                    <Text mt="-.5rem" color="gray.600">m<sup>2</sup></Text>
                                </Box>
                            </Center>

                            <Center border="1px solid rgb(0,0,0,0.2)" rounded="3xl" px="1rem" py=".5rem">
                                <Icon as={FaDoorOpen} w={"4rem"} h={"4rem"} />
                                <Box pl="1rem">
                                    <Text fontWeight={"bold"} fontSize="3xl">{(7).toLocaleString()}</Text>
                                    <Text mt="-.5rem" color="gray.600">Rooms</Text>
                                </Box>
                            </Center>

                            <Center border="1px solid rgb(0,0,0,0.2)" rounded="3xl" px="1rem" py=".5rem">
                                <Icon as={FaBed} w={"4rem"} h={"4rem"} />
                                <Box pl="1rem">
                                    <Text fontWeight={"bold"} fontSize="3xl">{(3).toLocaleString()}</Text>
                                    <Text mt="-.5rem" color="gray.600">Bedrooms</Text>
                                </Box>
                            </Center>
                        </HStack>
                    </Box>

                    <Box mt="2rem">
                        <iframe
                            style={{ overflow: "hidden", borderRadius: "24px" }}
                            width="100%"
                            height="500"
                            loading="lazy"
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDTE6cLA6Bbd0Z4kGVKUTXwke90lYHCIgo&q=${asset.street + " " + asset.number + ", " + asset.zip + " " + asset.city + " " + asset.country}`} /> {/* Hide API Key in .env file and use getStaticProps*/}
                    </Box>
                </Box>

                <RentalsFloatingActionCard tokenId={tokenId} pricePerDay={pricePerDay} />
            </Flex>
        </Box >
    );
}
