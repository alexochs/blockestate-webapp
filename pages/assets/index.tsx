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
import { abi } from "@/helpers/BlockEstateAssets.json";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import { Asset } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import { useSession } from "next-auth/react";

export default function AssetsPage() {
    const session = useSession();

    const [assets, setAssets] = useState<Object[] | null>(null);
    const [userAssets, setUserAssets] = useState<Object[] | null>(null);

    const readAllAssets = useContractRead({
        address: assetsContractAddress,
        abi,
        functionName: "readAllAssets",
        onSuccess: (data: Object[]) => {
            let assets = [];

            for (let i = 0; i < data.length; i++) {
                assets.push(Asset.fromSingleEntry(data[i]));
            }

            setAssets(assets);
        },
    });

    const readAssetsByHolder = useContractRead({
        address: assetsContractAddress,
        abi,
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
                ) : userAssets && userAssets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {userAssets.map((asset) => (
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
                ) : !assets ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : assets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {assets.map((asset) => (
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
