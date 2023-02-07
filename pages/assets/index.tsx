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
import { abi } from "@/helpers/BlockEstate.json";
import address from "@/helpers/contractAddress";
import { useEffect, useState } from "react";
import { Asset } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";

export default function AssetsPage() {
    const [assets, setAssets] = useState<Object[] | null>(null);

    const readAllAssets = useContractRead({
        address,
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

    return (
        <Box>
            <Heading fontSize="8xl" pb="2rem">
                Assets
            </Heading>

            <Box pb="2rem">
                <Link href="/create-asset">
                    <Button rounded="xl" colorScheme="blue" size="lg">
                        Tokenize your Asset
                    </Button>
                </Link>
            </Box>

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
    );
}
