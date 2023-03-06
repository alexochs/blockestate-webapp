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
    IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
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
    usdTokenAddress,
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
import { BiArea, BiHappyBeaming } from "react-icons/bi";
import { FaBed, FaCheckCircle, FaDoorOpen } from "react-icons/fa";
import RentalsFloatingActionCard from "@/components/RentalsFloatingActionCard";
import RentalInfoFloatingCard from "@/components/RentalInfoFloatingCard";
import ApproveFixedRentalButton from "@/components/Buttons/ApproveFixedRentalButton";
import CreateFixedRentalButton from "@/components/Buttons/CreateFixedRentalButton";
import { abi as usdAbi } from "@/helpers/USDToken.json";

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

export default function BookingAssetPage({
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

    const { checkinDate, checkoutDate } = router.query;
    const days = Math.round((Number(checkoutDate) - Number(checkinDate)) / (1000 * 60 * 60 * 24));

    const reservationPriceUsd = (pricePerDay / 1e6) * days;
    const feesPriceUsd = 210;
    const totalPrice = reservationPriceUsd + feesPriceUsd;

    const [allowance, setAllowance] = useState(0);
    const getAllowance = useContractRead({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "allowance",
        args: [session.data?.user?.address, rentalsContractAddress],
        onError: (error: any) => {
            console.log("allowance() error => ", error);
        },
        onSuccess: (data: any) => {
            console.log("allowance() success => ", data);
            setAllowance(parseInt(data._hex, 16));
        },
    });

    const {
        config: allowanceConfig,
        error: prepareAllowanceError,
        isError: isPrepareAllowanceError,
    } = usePrepareContractWrite({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "approve",
        args: [rentalsContractAddress, totalPrice * 1e6],
    });

    const { data: writeAllowanceData, error: writeAllowanceError, isError: writeAllowanceIsError, write: writeAllowance } = useContractWrite(allowanceConfig);

    const { isLoading: txAllowanceLoading, isSuccess: txAllowanceSuccess } = useWaitForTransaction({
        hash: writeAllowanceData?.hash,
        onSuccess: () => {
            router.reload();
        }
    });

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "createFixedRental",
        args: [tokenId, Math.round(Number(checkinDate) / 1000), days],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.reload();
        }
    });

    return (
        <Box>
            <HStack>
                <IconButton w="3rem" h="3rem" cursor="pointer" variant="ghost" rounded="full" aria-label="back" as={ChevronLeftIcon} onClick={() => router.push("/rent/" + tokenId)}>{"<"}</IconButton>
                <Heading fontSize="6xl">Approve and deposit</Heading>
            </HStack>

            <Flex mt="2rem">
                <Box w="60%" pr="1rem">
                    <Box>
                        <Heading size="2xl">Your stay</Heading>

                        <Box pt="1rem">
                            <Heading fontSize="xl">Check-in</Heading>
                            <Text>{new Date(Number(checkinDate)).toISOString()}</Text>
                        </Box>

                        <Box pt="1rem">
                            <Heading fontSize="xl">Check-out</Heading>
                            <Text>{new Date(Number(checkoutDate)).toISOString()}</Text>
                        </Box>
                    </Box>

                    <Box pt="4rem">
                        <Heading size="2xl">1. Approve funds for transfer</Heading>

                        <Text mt="2rem">Allow the BlockEstate Rentals contract to transfer your funds for your reservation.<br />This is necessary and will not transfer any funds.</Text>
                        <Text mt="1rem">Current allowance: {(allowance / 1e6).toLocaleString()}$</Text>

                        <Button
                            isDisabled={!writeAllowance || !session.data || allowance >= 100_000 * 1e6}
                            isLoading={txAllowanceLoading}
                            onClick={() => writeAllowance?.()}
                            h="4rem"
                            mt="2rem"
                            w="75%"
                            size="lg"
                            rounded="full"
                            colorScheme={"blue"}
                            variant="outline"
                        >
                            <Center>
                                <Icon as={FaCheckCircle} w={"1.75rem"} h={"1.75rem"} mr=".5rem" />
                                <Text fontSize="xl">{allowance >= 100_000 * 1e6 ? "Approved " + (allowance / 1e6).toLocaleString() + "$" : "Approve"}</Text>
                            </Center>
                        </Button>

                        {prepareAllowanceError && <Text pt="1rem" color="red">{Number(checkinDate) / 1000} Error: {prepareAllowanceError?.message}</Text>}
                    </Box>

                    <Box pt="4rem">
                        <Heading size="2xl">2. Deposit your reservation</Heading>

                        <Text mt="2rem">Transfer the total price of your reservation into the BlockEstate Rentals contract.<br />You will be immediately refunded upon cancelation.</Text>

                        <Button
                            h="4rem"
                            mt="2rem"
                            w="75%"
                            size="lg"
                            rounded="full"
                            colorScheme={"blue"}
                            variant="solid"
                            isDisabled={!write || prepareError != null || !session.data}
                            isLoading={isLoading}
                            onClick={() => write?.()}>
                            <Center>
                                <Icon as={BiHappyBeaming} w={"1.75rem"} h={"1.75rem"} mr=".5rem" />
                                <Text fontSize="xl" >
                                    Deposit and reserve your stay
                                </Text>
                            </Center>
                        </Button>

                        {prepareError && <Text pt="1rem" color="red">Error: {prepareError?.message}</Text>}
                    </Box>
                </Box>

                <RentalInfoFloatingCard pricePerDay={pricePerDay} asset={asset} days={days} />
            </Flex>
        </Box>
    );
}
