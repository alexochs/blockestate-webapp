import {
    Box,
    Button,
    GridItem,
    Heading,
    HStack,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useContractRead } from "wagmi";
import { abi } from "@/helpers/BlockEstate.json";
import address from "@/helpers/contractAddress";
import { useEffect, useState } from "react";
import { Asset, AssetCategory } from "@/helpers/types";
import AssetPreview from "@/components/AssetPreview";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import DeleteAssetButton from "@/components/Buttons/DeleteAssetButton";

export default function AssetsPage() {
    const session = useSession();
    const router = useRouter();
    const { tokenId } = router.query;
    const [asset, setAsset] = useState<Asset | null>(null);
    const [ownedTokens, setOwnedTokens] = useState<number[]>([]);

    const readAsset = useContractRead({
        address,
        abi,
        functionName: "readAsset",
        args: [tokenId],
        onSuccess: (data) => setAsset(Asset.fromSingleEntry(data)),
    });

    const getOwnedTokens = useContractRead({
        address,
        abi,
        functionName: "getOwnedTokens",
        args: [session.data?.user!.address as string],
        onSuccess: (data: any) =>
            data.length > 0 &&
            setOwnedTokens(data.map((x: any) => parseInt(x, 16))),
    });

    return (
        <Box>
            {!asset ? (
                <Spinner size="xl" />
            ) : (
                <VStack spacing="4rem" align={"start"}>
                    <Box>
                        <Heading>{asset?.country.toLocaleUpperCase()}</Heading>
                        <Text fontSize="3xl">{asset?.city}</Text>
                        <Text fontSize="2xl">
                            {asset?.street + " " + asset?.number}
                        </Text>
                    </Box>

                    <Heading>
                        {AssetCategory[asset?.category as AssetCategory]}
                    </Heading>

                    <Text fontSize="sm">BlockEstate: #{asset?.tokenId}</Text>
                </VStack>
            )}

            {ownedTokens.includes(asset?.tokenId!) && (
                <VStack pt="8rem" spacing="2rem" align="start">
                    <HStack spacing="1rem">
                        <Button isDisabled rounded="xl">
                            Create Shares
                        </Button>
                        <Button isDisabled rounded="xl">
                            Update
                        </Button>
                    </HStack>
                    <DeleteAssetButton tokenId={asset?.tokenId} />
                </VStack>
            )}
        </Box>
    );
}
