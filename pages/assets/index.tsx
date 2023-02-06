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
    const [assets, setAssets] = useState<Object[]>([]);

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
            <Heading fontSize="6xl" pb="2rem">
                Assets
            </Heading>

            <Box pb="2rem">
                <Link href="/create-asset">
                    <Button rounded="xl" colorScheme="blue" size="lg">
                        Tokenize your Asset
                    </Button>
                </Link>
            </Box>

            {assets.length < 1 ? (
                <Center>
                    <Spinner size="xl" />
                </Center>
            ) : (
                <SimpleGrid columns={[2, 3]} spacing="1rem">
                    {assets.map((asset) => (
                        <AssetPreview asset={asset} />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}
