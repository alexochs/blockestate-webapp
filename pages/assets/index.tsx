import {
    Box,
    Button,
    Center,
    GridItem,
    Heading,
    Link,
    SimpleGrid,
    Spinner,
    Text,
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
import { Asset } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import { getSession, useSession } from "next-auth/react";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    const data = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readSharesByHolder",
        args: [session.user?.address],
    })) as any;

    const shares = data.map((share: any) => parseInt(share._hex, 16));

    return {
        props: { user: session.user },
    };
}

export default function AssetsPage() {
    const session = useSession();

    const [allAssets, setAllAssets] = useState<Object[] | null>(null);
    const [userAssets, setUserAssets] = useState<Object[] | null>(null);

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

    const readAllAssets = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
        onSuccess: (data: Object[]) => {
            let assets = [];

            for (let i = 0; i < data.length; i++) {
                assets.push(Asset.fromSingleEntry(data[i]));
            }

            setAllAssets(assets);
        },
    });

    const readAssetsByHolder = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAssetsByHolder",
        args: [session?.data?.user?.address],
        onError: (error) => {
            console.log("readAssetsByHolder() => ", error);
        },
        onSuccess: (data: Object[]) => {
            let assets = [];

            for (let i = 0; i < data.length; i++) {
                assets.push(Asset.fromSingleEntry(data[i]));
            }

            setUserAssets(assets);
        },
    });

    return (
        <Box>
            <Box minH="50vh">
                <Heading fontSize="8xl" pb="2rem">
                    Your Assets
                </Heading>

                <Box pb="2rem">
                    <Link
                        href="/assets/create"
                        style={{ textDecoration: "none" }}
                    >
                        <Button
                            rounded="xl"
                            colorScheme="blue"
                            size="lg"
                            border="1px solid black"
                        >
                            Tokenize your Asset
                        </Button>
                    </Link>
                </Box>

                {readAssetsByHolder.isError ? (
                    <Text color="red">Error!</Text>
                ) : readAssetsByHolder.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : assets && assets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {assets.map((asset) => (
                            <AssetPreview asset={asset} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>You don't own any assets yet.</Text>
                        <Text fontWeight={"bold"}>Tokenize one now!</Text>
                    </Center>
                )}
            </Box>

            <Box minH="50vh">
                <Heading fontSize="8xl" pt="8rem" pb="2rem">
                    Explore Assets
                </Heading>

                {readAllAssets.isError ? (
                    <Text color="red">Error!</Text>
                ) : !allAssets ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : allAssets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {allAssets.map((asset) => (
                            <AssetPreview asset={asset} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>No assets have been tokenized yet.</Text>
                        <Text fontWeight={"bold"}>Be the first one!</Text>
                    </Center>
                )}
            </Box>
        </Box>
    );
}
