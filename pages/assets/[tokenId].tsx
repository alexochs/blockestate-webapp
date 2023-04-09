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
    Link,
    Icon,
} from "@chakra-ui/react";
import { useContractRead, useNetwork, useSwitchNetwork } from "wagmi";
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
    SharesListingPool,
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
import { SiOpensea } from "react-icons/si";
import { ethers } from "ethers";
import Head from "next/head";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    const tokenId = context.params.tokenId;

    // read asset
    const assetData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAsset",
        args: [tokenId],
    })) as any;

    const asset = Asset.fromSingleEntry(assetData);

    // read balance and total supply of shares
    const sharesBalanceData = session ? (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOf",
        args: [session.user?.address, tokenId],
    })) as any : null;

    const sharesTotalSupplyData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "totalSupply",
        args: [tokenId],
    })) as any;

    const sharesBalance = sharesBalanceData ? parseInt(sharesBalanceData._hex, 16) : 0;
    const sharesTotalSupply = parseInt(sharesTotalSupplyData._hex, 16);

    // read if user is major shareholder
    const shareholders = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readShareholdersByToken",
        args: [tokenId],
    }) as string[]).filter((shareholder) => shareholder != ethers.constants.AddressZero && shareholder != marketContractAddress);

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
    //shareholderInfos.filter((shareholderInfo) => shareholderInfo.address != marketContractAddress);

    // read listings of asset
    const listingPoolsData = (await readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readSharesListingPoolsByAsset",
        args: [tokenId],
    })) as any;

    const listingPools = listingPoolsData
        .map((listingPoolData: any) => SharesListingPool.fromSingleEntry(listingPoolData))
        .filter((listingPool: SharesListingPool) => listingPool.tokenId != 0 && listingPool.amount > 0);

    // read rentable and price per day of asset
    const isRentable = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isRentable",
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

    // return props to page
    return {
        props: {
            asset: JSON.parse(JSON.stringify(asset)),
            sharesBalance,
            sharesTotalSupply,
            shareholders,
            listingPools: JSON.parse(JSON.stringify(listingPools)),
            isRentable,
            pricePerDay,
            pricePerMonth,
            shareholderInfos,
        },
    };
}

export default function RentAssetsPage({
    asset,
    sharesBalance,
    sharesTotalSupply,
    shareholders,
    listingPools,
    isRentable,
    pricePerDay,
    pricePerMonth,
    shareholderInfos
}: any) {
    const session = useSession();
    const router = useRouter();
    const tokenId = asset.tokenId;

    const { chain } = useNetwork();
    const { chains, error: switchNetworkError, isLoading: switchNetworkIsLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

    const floorListingPool = listingPools.sort((a: SharesListingPool, b: SharesListingPool) => a.price - b.price)[0];
    const floorPrice = floorListingPool ? (floorListingPool.price / 10 ** 6) : 0;

    useEffect(() => {
        if (chain && chain.id !== 80001) {
            switchNetwork?.(80001);
        }
    });

    return (
        <>
            <Head>
                <title>{`${asset.street} ${asset.number} | ImmoVerse`}</title>
            </Head>
            <Box>
                <AssetHeader
                    asset={asset}
                />

                <AssetDescription
                    tokenId={tokenId}
                    sharesBalance={sharesBalance}
                    sharesTotalSupply={sharesTotalSupply}
                    shareholders={shareholders}
                    listingPools={listingPools}
                />

                <HStack pt="1rem" spacing="1rem">
                    <Link href={"/rent/" + tokenId} style={{ textDecoration: "none" }}>
                        <Button rounded="full" variant="outline" size="lg" colorScheme="blue">
                            Rent this asset
                        </Button>
                    </Link>

                    {sharesBalance > 0 &&
                        <Link href={"/shareholders/" + tokenId} style={{ textDecoration: "none" }}>
                            <Button rounded="full" variant="outline" size="lg" color="gray.500">
                                Shareholders Area
                            </Button>
                        </Link>}
                </HStack>

                <AssetInvestTabs
                    sharesBalance={sharesBalance}
                    listingPools={listingPools}
                    tokenId={tokenId}
                    shareholderInfos={shareholderInfos}
                    sharesTotalSupply={sharesTotalSupply}
                    floorPrice={floorPrice}
                    pricePerMonth={pricePerMonth}
                    pricePerDay={pricePerDay}
                    isRentable={isRentable}
                />
            </Box>
        </>
    );
}
