import { Box, Image, Heading, HStack, Input, Stack, VStack, Text, Divider, Flex, Center, Icon, Spacer, Button, Link } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import ApproveFixedRentalButton from "./Buttons/ApproveFixedRentalButton";
import ApproveMonthlyRentalButton from "./Buttons/ApproveMonthlyRentalButton";
import CancelFixedRentalButton from "./Buttons/CancelFixedRentalButton";
import CancelMonthlyRentalButton from "./Buttons/CancelMonthlyRentalButton";
import CreateFixedRentalButton from "./Buttons/CreateFixedRentalButton";
import CreateMonthlyRentalButton from "./Buttons/CreateMonthlyRentalButton";
import SetMonthlyRentableButton from "./Buttons/SetMonthlyRentableButton";
import SetRentableButton from "./Buttons/SetFixedRentableButton";

export default function RentalInfoFloatingCard({ asset, days, sharesBalance, fixedRentals, isRentable, pricePerDay, monthlyRentals, isMonthlyRentable, pricePerMonth }: any) {
    const router = useRouter();
    const session = useSession();
    //const userFixedRentals = fixedRentals.filter((rental: any) => rental.renter === session.data?.user?.address);
    //const userMonthlyRental = monthlyRentals.filter((rental: any) => rental.renter === session.data?.user?.address)[0];

    const ONE_DAY = 60 * 60 * 24 * 1000;
    const minDate = new Date(new Date().getTime() + ONE_DAY);
    const [checkinDate, setCheckinDate] = useState<Date>(minDate);
    const [checkoutDate, setCheckoutDate] = useState<Date>(
        new Date(minDate.getTime() + ONE_DAY)
    );

    const reservationPriceUsd = (pricePerDay / 1e6) * days;
    const feesPriceUsd = 210;
    const totalPrice = reservationPriceUsd + feesPriceUsd;

    const handleCheckinChange = (date: Date) => {
        setCheckinDate(date);
        if (date.getTime() >= checkoutDate.getTime()) {
            setCheckoutDate(new Date(date.getTime() + 60 * 60 * 24 * 1000));
        }
    }

    return (
        <VStack align={"start"} shadow="xl" border="1px solid rgb(0,0,0,0.2)" rounded="3xl" w="40%" maxH="65vh" mt="2rem" position={"sticky"} top="15vh" p="2rem" spacing="2rem">
            <Flex>
                <Image
                    src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/0cf46569-a5cd-4aa0-bbbd-156162c84e7e.jpeg"
                    fit="cover"
                    h="8rem"
                    w="8rem"
                    rounded="2xl"
                />
                <Center pl="1rem" flexDir="column" alignItems={"start"}>
                    <Heading fontSize="2xl" fontWeight="bold">{asset.city}, {asset.country}</Heading>
                    <HStack pt="1rem">
                        <Center>
                            <Icon as={FaStar} color="gray.600" />
                            <Text pl=".25rem" fontSize="md" color="gray.600" fontWeight={"bold"}>4.9</Text>
                        </Center>
                    </HStack>
                </Center>
            </Flex>

            <Divider />

            <Link href="https://immover.se" target="_blank">
                <Flex>
                    <Text>Your booking is protected by <b>Immo</b></Text>
                    <Text fontWeight="bold" color="blue.500">Care</Text>
                </Flex>
            </Link>

            <Divider />

            <Box w="100%">
                <Heading fontSize="2xl">Price details</Heading>

                <Flex w="100%">
                    <Text pt="1rem">{(pricePerDay / 1e6).toLocaleString()}$ x {days} day{days > 1 ? "s" : ""}</Text>
                    <Spacer />
                    <Text pt="1rem">{reservationPriceUsd.toLocaleString()}$</Text>
                </Flex>

                <Flex w="100%">
                    <Text pt="1rem">Fees</Text>
                    <Spacer />
                    <Text pt="1rem">{feesPriceUsd}$</Text>
                </Flex>
            </Box>

            <Divider />

            <Flex w="100%">
                <Text fontSize="lg" fontWeight="bold">Total</Text>
                <Spacer />
                <Text fontSize="lg" fontWeight="bold">{(totalPrice).toLocaleString()}$</Text>
            </Flex>
        </VStack >
    );
}
