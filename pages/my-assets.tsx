import { Box, Button, Center, Flex, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { assetsContractAddress, sharesContractAddress } from "@/helpers/contractAddresses";
import { abi as sharesAbi } from "helpers/BlockEstateShares.json";
import { abi as assetsAbi } from "helpers/BlockEstateAssets.json";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import { readContract } from "@wagmi/core";
import AssetPreview from "@/components/AssetPreviewCard";

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

    // read all assets
    const allAssetsData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAllAssets",
        args: []
    })) as any;

    const allAssets = allAssetsData.map((asset: any) =>
        Asset.fromSingleEntry(asset)
    );

    // read history of held shares
    const tokenHistoryData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "readSharesByHolder",
        args: [session.user?.address],
    })) as any;

    const tokenHistory = tokenHistoryData
        .map((share: any) => parseInt(share._hex, 16))
        .filter(
            (value: number, index: number, array: number[]) =>
                array.indexOf(value) === index
        );

    // read balances of held shares
    const sharesBalancesData = (await readContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOfBatch",
        args: [
            Array(tokenHistory.length).fill(session.user?.address),
            tokenHistory,
        ],
    })) as any;

    const sharesBalances = sharesBalancesData.map((balance: any) =>
        parseInt(balance._hex, 16)
    );

    // create tokenId + balance pairs and filter out 0 balances
    const shares = sharesBalances
        .map((balance: number, index: number) => ({
            tokenId: tokenHistory[index],
            balance,
        }))
        .filter((share: any) => share.balance > 0);

    const userAssets = allAssets.filter((asset: any) =>
        shares.find((share: any) => share.tokenId === asset.tokenId)
    );

    return {
        props: {
            user: session.user,
            userAssets: JSON.parse(JSON.stringify(userAssets)),
            shares,
        },
    };
}

export default function MyAssetsPage({ userAssets }: any) {
    return (
        <Box>
            <Heading fontSize="8xl" mb="2rem">My Assets</Heading>

            <Link
                href="/assets/create"
                style={{ textDecoration: "none" }}
            >
                <Button rounded="full" size="lg" variant="outline" color="gray.600">
                    Tokenize your asset
                </Button>
            </Link>

            {userAssets && userAssets.length > 0 ? (
                <SimpleGrid columns={[2, 3]} spacing="1rem" mt="2rem">
                    {userAssets.map((asset: any) => (
                        <AssetPreview key={asset.tokenId} asset={asset} />
                    ))}
                </SimpleGrid>
            ) : (
                <Center flexDir={"column"} mt="2rem">
                    <Text fontSize="2xl">You don&apos;t own any assets yet.</Text>

                    <Flex pt="1rem">
                        <Link href="/assets/create">
                            <Text fontWeight="bold">Tokenize your asset&nbsp;</Text>
                        </Link>

                        <Text>or&nbsp;</Text>

                        <Link href="/invest">
                            <Text fontWeight="bold">buy some shares.</Text>
                        </Link>
                    </Flex>
                </Center>
            )}
        </Box>
    );
}
