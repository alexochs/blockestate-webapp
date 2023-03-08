import { assetsContractAddress, rentalsContractAddress } from "@/helpers/contractAddresses";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import { Asset, FixedRental, MonthlyRental } from "@/helpers/types";
import { readContract } from "@wagmi/core";
import { getSession } from "next-auth/react";
import { Box, Center, Flex, Image, Heading, HStack, Link, Stack, Stat, StatArrow, StatHelpText, Text, Spacer, Button, Divider } from "@chakra-ui/react";
import SetFixedRentableButton from "@/components/Buttons/SetFixedRentableButton";
import ApproveFixedRentalButton from "@/components/Buttons/ApproveFixedRentalButton";

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
    const upcomingRentals = fixedRentals.filter((rental) => rental.start > Date.now() / 1000).sort((a, b) => a.start - b.start);
    const currentRental = fixedRentals.find((rental) => rental.start < Date.now() / 1000 && rental.end > Date.now() / 1000);

    return (
        <Box>
            <Heading fontSize="8xl">Shareholders Area</Heading>

            <Link href={"/invest/" + asset.tokenId} style={{ textDecoration: "none" }}>
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
                <Box mt="1rem" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" p="1rem" bg="gray.100">

                </Box>
            </Box>

            <Box pt="4rem">
                <Heading fontSize="6xl">Rentals</Heading>
                <Box mt="1rem" h="16rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" p="1rem">
                    <Heading fontSize="2xl" mb="1rem">{currentRental ? "Current rental" : "Upcoming rental"}</Heading>

                    {currentRental ?
                        <Flex border="1px solid rgb(0,0,0,0.2)" p="1rem" rounded="xl" bg="gray.100" _hover={{ background: "gray.200" }} cursor="pointer">
                            <Box>
                                <Text>Token ID: {currentRental.tokenId}</Text>
                                <Text>Renter: {currentRental.renter.slice(2, 8)}</Text>
                                <Text>Check-in: {new Date(currentRental.start).toUTCString()}</Text>
                                <Text>Check-out: {new Date(currentRental.end).toUTCString()}</Text>
                                <Text>Price: {(currentRental.price / 1e6).toLocaleString()}$</Text>
                            </Box>
                        </Flex> :
                        <Center fontSize="xl" textAlign={"center"} flexDir="column" h="75%" p="1rem">
                            <Text>Token ID: {upcomingRentals[0].tokenId}</Text>
                            <Text>Renter: {upcomingRentals[0].renter.slice(2, 8)}</Text>
                            <Text>Check-in: {new Date(upcomingRentals[0].start).toUTCString()}</Text>
                            <Text>Check-out: {new Date(upcomingRentals[0].end).toUTCString()}</Text>
                            <Text>Price: {(upcomingRentals[0].price / 1e6).toLocaleString()}$</Text>
                        </Center>}
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
                    <Box mt="1rem" mr="1rem" w="75%" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0, 0.2)" p="1rem">
                        <Heading fontSize="2xl">Fixed rentals</Heading>

                        {fixedRentals.length > 0 ? (
                            <Stack overflow={"scroll"} spacing="1rem" my="1rem" h="85%" rounded="xl">
                                {fixedRentals.sort((a, b) => a.start - b.start).map((rental) => (
                                    <Flex key={rental.rentalId} border="1px solid rgb(0,0,0,0.2)" p="1rem" rounded="xl" bg="gray.100" _hover={{ background: "gray.200" }} cursor="pointer">
                                        <Box>
                                            <Text>Token ID: {rental.tokenId}</Text>
                                            <Text>Renter: {rental.renter.slice(2, 8)}</Text>
                                            <Text>Check-in: {new Date(rental.start).toUTCString()}</Text>
                                            <Text>Check-out: {new Date(rental.end).toUTCString()}</Text>
                                            <Text>Price: {(rental.price / 1e6).toLocaleString()}$</Text>
                                        </Box>

                                        <Spacer />
                                        <Divider orientation="vertical" />
                                        <Spacer />

                                        <Center flexDir="column">
                                            <Text>Approval: {rental.isApproved ? "Confirmed" : "Pending"}</Text>
                                            <Text>Votes: {rental.votes}</Text>
                                        </Center>

                                        <Spacer />
                                        <Divider orientation="vertical" />
                                        <Spacer />

                                        <Center>
                                            <ApproveFixedRentalButton rental={rental} />
                                        </Center>
                                    </Flex>
                                ))}
                            </Stack>) : (
                            <Text fontSize="lg">You do not have any upcoming trips!</Text>
                        )}
                    </Box>
                    <Box mt="1rem" w="25%" h="24rem" rounded="3xl" border="1px solid rgb(0,0,0,0.2)">
                        <Center h="100%" p="1rem">
                            <SetFixedRentableButton tokenId={asset.tokenId} isRentable={isRentable} pricePerDay={pricePerDay} />
                        </Center>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}