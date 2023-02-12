import {
    assetsContractAddress,
    sharesContractAddress,
} from "@/helpers/contractAddresses";
import { Asset } from "@/helpers/types";
import {
    Box,
    Heading,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AssetPreview from "@/components/AssetPreview";

export default function SharesPage() {
    const session = useSession();

    const [assets, setAssets] = useState<Asset[] | null>(null);
    const [shares, setShares] = useState<Object[] | null>(null);
    const [balances, setBalances] = useState<number[] | null>(null);
    const [supplies, setSupplies] = useState<number[] | null>(null);

    const readShares = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readSharesByHolder",
        args: [session?.data?.user!.address],
        onSuccess: (data: Object[]) => {
            setShares(
                data
                    .map((share: any) => parseInt(share._hex, 16))
                    .filter((x, i, a) => a.indexOf(x) == i)
            );
        },
    });

    const readBalances = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOfBatch",
        args: [
            Array(shares?.length).fill(session?.data?.user!.address),
            shares,
        ],
        onSuccess: (data: Object[]) => {
            setBalances(data.map((balance: any) => parseInt(balance._hex, 16)));
        },
    });

    const readSupplies = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "totalSupplyBatch",
        args: [assets?.map((asset) => asset.tokenId)],
        onSuccess: (data: Object[]) => {
            setSupplies(data.map((supply: any) => parseInt(supply._hex, 16)));
        },
    });

    const readAssets = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAssetBatch",
        args: [shares],
        onSuccess: (data: Object[]) => {
            setAssets(data.map((asset: any) => Asset.fromSingleEntry(asset)));
        },
    });

    return (
        <Box>
            <Heading fontSize="8xl" pb="2rem">
                Your Shares
            </Heading>

            {!shares || readShares.isError ? (
                <Spinner size="lg" />
            ) : assets && assets.length < 1 ? (
                <Text>You don&apos;t own any Shares!</Text>
            ) : (
                <SimpleGrid columns={[2, 3]} spacing="1rem">
                    {assets?.map((asset: Asset, index) => {
                        return (
                            <VStack>
                                <AssetPreview asset={asset} />
                                <Text>
                                    {balances && supplies
                                        ? `You own ${
                                              (balances[index] /
                                                  supplies[index]) *
                                              100
                                          }%`
                                        : ""}
                                </Text>
                            </VStack>
                        );
                    })}
                </SimpleGrid>
            )}
        </Box>
    );
}
