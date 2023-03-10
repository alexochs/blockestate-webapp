import { Box, Heading, HStack, Input, Stack, VStack, Text, Divider, Flex, Center, Icon, Spacer, Button } from "@chakra-ui/react";
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

export default function RentalsFloatingActionCard({ tokenId, sharesBalance, fixedRentals, isRentable, pricePerDay, monthlyRentals, isMonthlyRentable, pricePerMonth }: any) {
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

    const handleCheckinChange = (date: Date) => {
        setCheckinDate(date);
        if (date.getTime() >= checkoutDate.getTime()) {
            setCheckoutDate(new Date(date.getTime() + 60 * 60 * 24 * 1000));
        }
    }

    return (
        <VStack shadow="xl" border="1px solid rgb(0,0,0,0.2)" rounded="3xl" w="30%" h="65vh" mt="2rem" position={"sticky"} top="15vh" p="2rem" spacing="2rem">
            <Flex w="100%" px="2rem">
                <Center>
                    <Text fontSize="3xl" fontWeight="bold">{(pricePerDay / 1e6).toLocaleString()}$&nbsp;</Text>
                    <Text fontSize="xl">Night</Text>
                </Center>

                <Spacer />

                <Center>
                    <Icon ml="2rem" mr=".125rem" as={FaStar} w="1.125rem" h="1.125rem" />
                    <Text fontWeight="bold" fontSize="xl">New&nbsp;</Text>
                </Center>
            </Flex>

            <VStack spacing="1rem" w="100%">
                <Box w="100%">
                    <Text pl=".5rem">Check-in</Text>
                    <SingleDatepicker
                        name="checkin-date-input"
                        date={checkinDate}
                        onDateChange={handleCheckinChange}
                        minDate={minDate}
                        propsConfigs={{
                            inputProps: {
                                rounded: "full",
                                fontSize: "lg"
                            },
                            dayOfMonthBtnProps: {
                                defaultBtnProps: {
                                    rounded: "full",
                                    _hover: {
                                        background: 'blackAlpha.200',
                                        color: "gray.700"
                                    }
                                },
                                isInRangeBtnProps: {
                                    color: "yellow",
                                },
                                selectedBtnProps: {
                                    background: "blue.300",
                                    color: "white",
                                },
                                todayBtnProps: {
                                    border: "1px solid rgb(0,0,0,0.5)",
                                }
                            },
                            popoverCompProps: {
                                popoverContentProps: {
                                    rounded: "3xl",
                                },
                            },
                            dateNavBtnProps: {
                                rounded: "full",
                            },
                        }}
                    />
                </Box>

                <Box w="100%">
                    <Text pl=".5rem">Check-out</Text>
                    <SingleDatepicker
                        name="checkout-date-input"
                        date={checkoutDate}
                        onDateChange={setCheckoutDate}
                        minDate={
                            new Date(
                                new Date(
                                    new Date().getTime() + 60 * 60 * 24 * 1000
                                ).setHours(0, 0, 0, 0)
                            )
                        }
                        propsConfigs={{
                            inputProps: {
                                rounded: "full",
                                fontSize: "lg"
                            },
                            dayOfMonthBtnProps: {
                                defaultBtnProps: {
                                    rounded: "full",
                                    _hover: {
                                        background: 'blackAlpha.200',
                                        color: "gray.700"
                                    }
                                },
                                isInRangeBtnProps: {
                                    color: "yellow",
                                },
                                selectedBtnProps: {
                                    background: "blue.300",
                                    color: "white",
                                },
                                todayBtnProps: {
                                    border: "1px solid rgb(0,0,0,0.5)",
                                }
                            },
                            popoverCompProps: {
                                popoverContentProps: {
                                    rounded: "3xl",
                                },
                            },
                            dateNavBtnProps: {
                                rounded: "full",
                            },
                        }}
                    />
                </Box>
            </VStack>

            <VStack spacing="1rem" w="100%">
                <Button fontSize="lg" size="lg" w="100%" rounded="full" colorScheme={"blue"} onClick={() => router.push({ pathname: `/rent/booking/${tokenId}`, query: { checkinDate: checkinDate.getTime(), checkoutDate: checkoutDate.getTime() } })}>
                    {session.data ? "Reserve" : "Sign in to reserve"}
                </Button>
                <Text fontSize="sm">You won&apos;t be charged yet.</Text>
            </VStack>

            <Spacer />
            <Divider />

            <Flex w="100%">
                <Text fontSize="lg" fontWeight="bold">Total</Text>
                <Spacer />
                <Text fontSize="lg">{420}$</Text>
            </Flex>
        </VStack >
    );
}
