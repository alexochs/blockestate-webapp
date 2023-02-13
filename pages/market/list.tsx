import { assetsContractAddress } from "@/helpers/contractAddresses";
import {
    Box,
    Button,
    Center,
    Heading,
    Link,
    SimpleGrid,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useContractRead } from "wagmi";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { useState } from "react";
import { Asset } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import CreateAssetListingButton from "@/components/Buttons/CreateAssetListingButton";
import { ethers } from "ethers";

export default function MarketListPage() {
    const session = useSession();

    const [userAssets, setUserAssets] = useState<Object[] | null>(null);

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
                {readAssetsByHolder.isError ? (
                    <Text color="red">Error!</Text>
                ) : readAssetsByHolder.isLoading ? (
                    <Center>
                        <Spinner size="xl" />
                    </Center>
                ) : userAssets && userAssets.length > 0 ? (
                    <SimpleGrid columns={[2, 3]} spacing="1rem">
                        {userAssets.map((asset: any) => (
                            <Link
                                href={"/shares/list?tokenId=" + asset.tokenId}
                            >
                                <Box
                                    p="1rem"
                                    border="1px solid black"
                                    rounded="3xl"
                                >
                                    <Heading>
                                        {asset.street} {asset.number}
                                    </Heading>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center flexDir={"column"}>
                        <Text>You don't own any assets yet.</Text>
                        <Text fontWeight={"bold"}>Tokenize one now!</Text>
                    </Center>
                )}
            </Box>
        </Box>
    );
}
