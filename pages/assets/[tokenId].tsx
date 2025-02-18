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
    useMediaQuery,
} from "@chakra-ui/react";
import { useReadContract, useChainId, useSwitchChain } from "wagmi";
import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';
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

    const client = createPublicClient({
        chain: polygonAmoy,
        transport: http()
    });

    // read asset
    const assetData = await client.readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAsset",
        args: [BigInt(tokenId)],
    });

    const asset = Asset.fromSingleEntry(assetData);

    // read balance and total supply of shares
    const sharesBalance = session ? Number(await client.readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOf",
        args: [session.user?.address, BigInt(tokenId)],
    })) : 0;

    const sharesTotalSupply = Number(await client.readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "totalSupply",
        args: [BigInt(tokenId)],
    }));

    return {
        props: {
            asset: JSON.parse(JSON.stringify(asset)),
            sharesBalance,
            sharesTotalSupply,
        },
    };
}

export default function RentAssetsPage({
    asset,
    sharesBalance,
    sharesTotalSupply,
}: any) {
    const isMobile = useMediaQuery("(max-width: 768px)")[0];
    const session = useSession();
    const router = useRouter();
    const tokenId = asset.tokenId;

    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    useEffect(() => {
        if (chainId !== 80002) {
            switchChain?.({ chainId: 80002 });
        }
    }, [chainId, switchChain]);

    const [pricePerMonth, setPricePerMonth] = useState(0);
    const { data: pricePerMonthData } = useReadContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerMonth",
        args: [BigInt(tokenId)],
    });

    useEffect(() => {
        if (pricePerMonthData) setPricePerMonth(Number(pricePerMonthData));
    }, [pricePerMonthData]);

    const [pricePerDay, setPricePerDay] = useState(0);
    const { data: pricePerDayData } = useReadContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerDay",
        args: [BigInt(tokenId)],
    });

    useEffect(() => {
        if (pricePerDayData) setPricePerDay(Number(pricePerDayData));
    }, [pricePerDayData]);

    const [isRentable, setIsRentable] = useState(false);
    const { data: isRentableData } = useReadContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isRentable",
        args: [BigInt(tokenId)],
    });

    useEffect(() => {
        if (isRentableData !== undefined) setIsRentable(Boolean(isRentableData));
    }, [isRentableData]);

    const [listingPools, setListingPools] = useState<SharesListingPool[]>([]);
    const [floorListingPool, setFloorListingPool] = useState<SharesListingPool>();
    const [floorPrice, setFloorPrice] = useState<number>(0);
    const { data: listingPoolsData } = useReadContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "readSharesListingPoolsByAsset",
        args: [BigInt(tokenId)],
    }) as { data: any[] };

    useEffect(() => {
        if (listingPoolsData) {
            const pools = listingPoolsData
                .map((data: any) => SharesListingPool.fromSingleEntry(data))
                .filter((pool: SharesListingPool) => pool.tokenId !== 0 && pool.amount > 0);

            setListingPools(pools);

            const floorPool = pools.sort(
                (a: SharesListingPool, b: SharesListingPool) => a.price - b.price
            )[0];

            setFloorListingPool(floorPool);
            setFloorPrice(floorPool ? (floorPool.price / 10 ** 6) : 0);
        }
    }, [listingPoolsData]);

    const [shareholders, setShareholders] = useState<string[]>([]);
    const [shareholderInfos, setShareholderInfos] = useState<any[]>([]);
    const { data: shareholdersData } = useReadContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readShareholdersByToken",
        args: [BigInt(tokenId)],
    }) as { data: string[] };

    useEffect(() => {
        async function updateShareholderInfos() {
            if (shareholdersData) {
                const client = createPublicClient({
                    chain: polygonAmoy,
                    transport: http()
                });

                const filteredShareholders = shareholdersData.filter(
                    (shareholder: string) =>
                        shareholder !== ethers.constants.AddressZero &&
                        shareholder !== marketContractAddress
                );

                setShareholders(filteredShareholders);

                const infos = await Promise.all(
                    filteredShareholders.map(async (shareholder: string) => {
                        const balance = await client.readContract({
                            address: sharesContractAddress,
                            abi: sharesAbi,
                            functionName: "balanceOf",
                            args: [shareholder, BigInt(tokenId)],
                        });

                        return {
                            address: shareholder,
                            balance: Number(balance),
                        };
                    })
                );

                setShareholderInfos(infos);
            }
        }

        updateShareholderInfos();
    }, [shareholdersData, tokenId]);

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

                <Stack direction={["column", "row"]} pt="1rem" spacing="1rem">
                    {!isMobile ?
                        <Link href={"/rent/" + tokenId} style={{ textDecoration: "none" }}>
                            <Button rounded="full" variant="outline" size="lg" colorScheme="blue">
                                Rent this asset
                            </Button>
                        </Link> :
                        <Button isDisabled rounded="full" variant="outline" size="lg" colorScheme="blue">
                            Rent this asset
                        </Button>}

                    {sharesBalance > 0 &&
                        <Button rounded="full" variant="outline" size="lg" color="gray.500">
                            <Link href={"/shareholders/" + tokenId} style={{ textDecoration: "none" }}>
                                Shareholders Area
                            </Link>
                        </Button>}
                </Stack>

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
