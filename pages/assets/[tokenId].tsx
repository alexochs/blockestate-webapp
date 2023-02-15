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
import { useSession } from "next-auth/react";
import DeleteAssetButton from "@/components/Buttons/DeleteAssetButton";

export default function AssetsPage() {
    const session = useSession();
    const router = useRouter();
    const { tokenId } = router.query;

    const [asset, setAsset] = useState<Asset | null>(null);
    const [assetOwner, setAssetOwner] = useState<string>("");
    const [sharesBalance, setSharesBalance] = useState<number>(0);
    const [sharesTotalSupply, setSharesTotalSupply] = useState<number>(0);

    const readAsset = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAsset",
        args: [tokenId],
        onSuccess: (data) => setAsset(Asset.fromSingleEntry(data)),
    });

    const ownerOf = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "ownerOf",
        args: [tokenId],
        onSuccess: (data: any) => setAssetOwner(data),
    });

    const readSharesBalance = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOf",
        args: [session?.data?.user!.address, tokenId],
        onError: (error) =>
            console.log(
                `balanceOf(${session?.data?.user!.address}, ${tokenId}) => `,
                error
            ),
        onSuccess: (data: any) => {
            const sharesBalance = parseInt(data._hex, 16);
            console.log(sharesBalance);
            setSharesBalance(parseInt(data._hex, 16));
        },
    });

    const readSharesTotalSupply = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "totalSupply",
        args: [tokenId],
        onError: (error) => console.log(`totalSupply(${tokenId}) => `, error),
        onSuccess: (data: any) => {
            setSharesTotalSupply(parseInt(data._hex, 16));
        },
    });

    return (
        <Box>
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
                            {AssetCategory[asset?.category as AssetCategory]}
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

            <Text>
                You own {sharesBalance} out of {sharesTotalSupply} (
                {((sharesBalance / sharesTotalSupply) * 100).toFixed(2)}%) Share
                {sharesTotalSupply > 1 ? "s" : ""}.
            </Text>

            {session.status == "authenticated" &&
                session.data?.user!.address && (
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

                            {assetOwner == session.data.user.address && (
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
                            )}

                            {sharesBalance > 0 && (
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
                            )}
                        </HStack>

                        {assetOwner == session.data.user.address && (
                            <Button isDisabled rounded="xl">
                                Update
                            </Button>
                        )}

                        {assetOwner == session.data.user.address && (
                            <DeleteAssetButton tokenId={asset?.tokenId} />
                        )}
                    </VStack>
                )}
        </Box>
    );
}
