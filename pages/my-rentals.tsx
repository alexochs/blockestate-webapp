import { Box, Button, Center, Flex, Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { assetsContractAddress, rentalsContractAddress, sharesContractAddress } from "@/helpers/contractAddresses";
import { abi as sharesAbi } from "helpers/BlockEstateShares.json";
import { abi as assetsAbi } from "helpers/BlockEstateAssets.json";
import { abi as rentalsAbi } from "helpers/BlockEstateRentals.json";
import { getSession } from "next-auth/react";
import { Asset, FixedRental } from "@/helpers/types";
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

    // read fixed rentals
    const readFixedRentalsByAccountData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "readFixedRentalsByAccount",
        args: [session?.user?.address]
    })) as any;
    console.log(readFixedRentalsByAccountData);
    const fixedRentals = readFixedRentalsByAccountData.map((rental: any) => new FixedRental(rental));
    console.log(fixedRentals);

    return {
        props: {
            user: session.user,
            allAssets: JSON.parse(JSON.stringify(allAssets)),
            fixedRentals: JSON.parse(JSON.stringify(fixedRentals)),
        },
    };
}

export default function MyRentalsPage({ user, allAssets, fixedRentals }: { user: any, allAssets: Asset[], fixedRentals: FixedRental[] }) {
    return (
        <Box>
            <Heading fontSize="8xl" mb="2rem">My Rentals</Heading>

            <Box mt="1rem" h="16rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" p="1rem">
                <Heading fontSize="2xl">Your upcoming trip</Heading>
                <Center h="100%">
                    <Text>Preview current running rental</Text>
                </Center>
            </Box>

            <Flex w="100%" mt="1rem" h="24rem">
                <Box w="50%" h="100%" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" p="1rem">
                    <Heading fontSize="2xl">Bed & Breakfast</Heading>

                    {fixedRentals.length > 0 ? (
                        <Stack overflow={"scroll"} spacing="1rem" my="1rem" h="85%" rounded="xl">
                            {fixedRentals.sort((a, b) => a.start - b.start).map((rental) => (
                                <Box key={rental.rentalId} border="1px solid rgb(0,0,0,0.2)" p="1rem" rounded="xl" bg="gray.100" _hover={{ background: "gray.200" }} cursor="pointer">
                                    <Text>Token ID: {rental.tokenId}</Text>
                                    <Text>Check-in: {new Date(rental.start).toUTCString()}</Text>
                                    <Text>Check-out: {new Date(rental.end).toUTCString()}</Text>
                                    <Text>Price: {rental.price / 1e6}</Text>
                                    <Text>Approval: {rental.isApproved ? "Confirmed" : "Pending"}</Text>
                                </Box>
                            ))}
                        </Stack>) : (
                        <Text fontSize="lg">You do not have any upcoming trips!</Text>
                    )}
                </Box>

                <Box ml="1rem" w="50%" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" p="1rem">
                    <Heading fontSize="2xl">Monthly rental</Heading>
                    <Center h="100%">
                        <Text>Preview current running rental</Text>
                    </Center>
                </Box>
            </Flex>
        </Box>
    );
}
