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
import {
    assetsContractAddress,
    sharesContractAddress,
} from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import { Asset, AssetCategory } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import DeleteAssetButton from "@/components/Buttons/DeleteAssetButton";
import ListingsCard from "@/components/ListingsCard";

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

    return {
        props: {
            user: session.user,
            asset: JSON.parse(JSON.stringify(asset)),
            sharesBalance,
            sharesTotalSupply,
            isMajorShareholder,
        },
    };
}

export default function AssetsPage({
    user,
    asset,
    sharesBalance,
    sharesTotalSupply,
    isMajorShareholder,
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

            <Center w="35%">
                <ListingsCard
                    sharesBalance={sharesBalance}
                    sharesTotalSupply={sharesTotalSupply}
                />

                {session.status == "authenticated" && user.address && (
                    <VStack pt="8rem" spacing="2rem" align="start">
                        <HStack spacing="1rem">
                            {sharesBalance > 0 && (
                                <Button
                                    variant="outline"
                                    border="1px"
                                    rounded="xl"
                                    onClick={() =>
                                        router.push(
                                            "/shares/list?tokenId=" + tokenId
                                        )
                                    }
                                >
                                    List Shares
                                </Button>
                            )}

                            {/*isMajorShareholder && (
                            <Button
                                variant="outline"
                                border="1px"
                                rounded="xl"
                                onClick={() =>
                                    router.push(
                                        "/shares/create?tokenId=" + tokenId
                                    )
                                }
                            >
                                Create Shares
                            </Button>
                            )*/}

                            {/*sharesBalance > 0 && (
                            <Button
                                colorScheme={"red"}
                                variant="ghost"
                                rounded="xl"
                                onClick={() =>
                                    router.push(
                                        "/shares/burn?tokenId=" + tokenId
                                    )
                                }
                            >
                                Burn Shares
                            </Button>
                            )*/}
                        </HStack>

                        {/*isMajorShareholder && (
                        <Button isDisabled rounded="xl">
                            Update
                        </Button>
                    )*/}

                        {/*isMajorShareholder && (
                        <DeleteAssetButton tokenId={asset?.tokenId} />
                    )*/}
                    </VStack>
                )}
            </Center>
        </Flex>
    );
}
