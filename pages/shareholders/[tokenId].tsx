import { assetsContractAddress, rentalsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import { Asset, FixedRental, MonthlyRental } from "@/helpers/types";
import { readContract } from "@wagmi/core";
import { getSession } from "next-auth/react";
import { Box, Center, Flex, Image, Heading, HStack, Link, Stack, Stat, StatArrow, StatHelpText, Text } from "@chakra-ui/react";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    const tokenId = context.params.tokenId;

    // redirect if not authenticated
    if (!session || !tokenId) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    // read asset
    const assetData = (await readContract({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAsset",
        args: [tokenId],
    })) as any;

    const asset = Asset.fromSingleEntry(assetData);

    // read fixed rentals
    const fixedRentalsData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "readFixedRentalsByToken",
        args: [tokenId],
    })) as any;
    const fixedRentals = fixedRentalsData.map((entry: any) => new FixedRental(entry));

    const isRentable = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isRentable",
        args: [tokenId],
    })) as any;

    const pricePerDayData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerDay",
        args: [tokenId],
    })) as any;
    const pricePerDay = parseInt(pricePerDayData._hex, 16);

    // read monthly rentals
    const monthlyRentalsData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "readMonthlyRentalsByToken",
        args: [tokenId],
    })) as any;
    const monthlyRentals = monthlyRentalsData.map((entry: any) => new MonthlyRental(entry));

    const isMonthlyRentable = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isMonthlyRentable",
        args: [tokenId],
    })) as any;

    const pricePerMonthData = (await readContract({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerMonth",
        args: [tokenId],
    })) as any;
    const pricePerMonth = parseInt(pricePerMonthData._hex, 16);

    // return props to page
    return {
        props: {
            user: session.user,
            asset: JSON.parse(JSON.stringify(asset)),
            fixedRentals: JSON.parse(JSON.stringify(fixedRentals)),
            isRentable,
            pricePerDay,
            monthlyRentals: JSON.parse(JSON.stringify(monthlyRentals)),
            isMonthlyRentable,
            pricePerMonth,
        },
    };
}

export default function ShareholdersPage({ user, asset, fixedRentals, isRentable, pricePerDay, monthlyRentals, isMonthlyRentable, pricePerMonth }:
    { user: any, asset: Asset, fixedRentals: FixedRental[], isRentable: boolean, pricePerDay: number, monthlyRentals: MonthlyRental[], isMonthlyRentable: boolean, pricePerMonth: number }) {
    return (
        <Box>
            <Heading fontSize="8xl">Shareholders Area</Heading>

            <Link href={"/assets/" + asset.tokenId} style={{ textDecoration: "none" }}>
                <Box pt="1rem">
                    <Flex p="1rem" border="1px solid rgb(0, 0, 0, 0.2)" rounded="3xl" _hover={{ background: "gray.100" }}>
                        <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/e5596519-efcf-4a65-bd12-3191ebd33ee6.jpeg" fit="cover" h="8rem" w="8rem" rounded="2xl" />

                        <Center ml="2rem" flexDir="column" alignItems={"start"}>
                            <Heading fontSize="3xl">{asset.street} {asset.number}</Heading>
                            <Text fontSize="2xl" color="gray.600">{asset.city}, {asset.country}</Text>
                            {asset.category == 0 && <Text fontSize="xl" color="gray.500">Apartment {asset.apNumber}</Text>}
                        </Center>

                        <HStack ml="4rem" spacing="4rem">
                            <Stack spacing="-.25rem">
                                <Text fontSize="2xl" fontWeight="bold" color="blackAlpha.700">Floor</Text>
                                <Text fontSize="2xl">13,420$</Text>
                                <Stat>
                                    <StatHelpText>
                                        <StatArrow type='increase' />
                                        5.36%
                                    </StatHelpText>
                                </Stat>
                            </Stack>

                            <Stack spacing="-.25rem">
                                <Text fontSize="2xl" fontWeight="bold" color="blackAlpha.700">24h Volume</Text>
                                <Text fontSize="2xl">42,187$</Text>
                                <Stat>
                                    <StatHelpText>
                                        <StatArrow type='increase' />
                                        23.36%
                                    </StatHelpText>
                                </Stat>
                            </Stack>

                            <Stack spacing="-.25rem">
                                <Text fontSize="2xl" fontWeight="bold" color="blackAlpha.700">Annual ROI</Text>
                                <Text fontSize="2xl">168%</Text>
                                <Stat>
                                    <StatHelpText>
                                        <StatArrow type='increase' />
                                        2.12%
                                    </StatHelpText>
                                </Stat>
                            </Stack>
                        </HStack>
                    </Flex>
                </Box>
            </Link>

            <Box pt="4rem">
                <Heading fontSize="6xl">Proposals</Heading>
                <Box mt="1rem" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" bg="gray.100">
                    <Center h="100%">
                        <Text>Preview list of proposals the shareholder can vote on</Text>
                    </Center>
                </Box>
            </Box>

            <Box pt="4rem">
                <Heading fontSize="6xl">Rentals</Heading>
                <Box mt="1rem" h="16rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" bg="gray.100">
                    <Center h="100%">
                        <Text>Preview current rental</Text>
                    </Center>
                </Box>

                <Flex>
                    <Box mt="1rem" mr="1rem" w="75%" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" bg="gray.100">
                        <Center h="100%">
                            <Text>Preview list of upcoming monthly rentals and requests</Text>
                        </Center>
                    </Box>
                    <Box mt="1rem" w="25%" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" bg="gray.100">
                        <Center h="100%" p="1rem">
                            <Text textAlign="center">Manage monthly rental settings<br />(create proposal to change settings)</Text>
                        </Center>
                    </Box>
                </Flex>

                <Flex>
                    <Box mt="1rem" mr="1rem" w="75%" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" bg="gray.100">
                        <Center h="100%">
                            <Text>Preview list of upcoming fixed rentals and requests</Text>
                        </Center>
                    </Box>
                    <Box mt="1rem" w="25%" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" bg="gray.100">
                        <Center h="100%" p="1rem">
                            <Text textAlign="center">Manage fixed rental settings<br />(create proposal to change settings)</Text>
                        </Center>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}