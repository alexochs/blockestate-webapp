import { Box, Heading, HStack, Input, Stack, VStack, Text, Divider } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ApproveFixedRentalButton from "./Buttons/ApproveFixedRentalButton";
import ApproveMonthlyRentalButton from "./Buttons/ApproveMonthlyRentalButton";
import CancelFixedRentalButton from "./Buttons/CancelFixedRentalButton";
import CancelMonthlyRentalButton from "./Buttons/CancelMonthlyRentalButton";
import CreateFixedRentalButton from "./Buttons/CreateFixedRentalButton";
import CreateMonthlyRentalButton from "./Buttons/CreateMonthlyRentalButton";
import SetMonthlyRentableButton from "./Buttons/SetMonthlyRentableButton";
import SetRentableButton from "./Buttons/SetFixedRentableButton";

export default function RentalsCard({ tokenId, sharesBalance, fixedRentals, isRentable, pricePerDay, monthlyRentals, isMonthlyRentable, pricePerMonth }: any) {
    const session = useSession();
    const userFixedRentals = fixedRentals.filter((rental: any) => rental.renter === session.data?.user?.address);
    const userMonthlyRental = monthlyRentals.filter((rental: any) => rental.renter === session.data?.user?.address)[0];

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
        <VStack
            rounded={"3xl"}
            border={"1px solid rgb(100, 100, 100)"}
            bgGradient="linear(to-br, rgb(255, 255, 255, 0.2), rgb(255, 255, 255, 0.1))"
            backdropFilter={"blur(0.25rem)"}
            mx="1rem"
            p="1.5rem"
            w="24rem"
            spacing="2rem"
        >
            <VStack spacing="1rem">
                <Heading fontWeight="bold" fontSize="2xl">
                    Fixed Rental
                </Heading>

                {!sharesBalance ? userFixedRentals.length < 1 ? (
                    // Create rental
                    <VStack spacing="1rem">
                        <SingleDatepicker
                            name="checkin-date-input"
                            date={checkinDate}
                            onDateChange={handleCheckinChange}
                            minDate={minDate}
                        />

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
                        />

                        <CreateFixedRentalButton
                            tokenId={tokenId}
                            checkinDate={checkinDate}
                            checkoutDate={checkoutDate}
                        />
                    </VStack>
                ) :
                    // User monthly Rental
                    <Box>
                        {userFixedRentals.length > 0 ? (
                            userFixedRentals.map((rental: any) => (
                                <VStack key={rental.rentalId} p="1rem" border="1px solid black" spacing="1rem" rounded="xl">
                                    <HStack>
                                        <Text>Checkin Date:</Text>
                                        <Text>{new Date(rental.start).toLocaleDateString()}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text>Checkout Date:</Text>
                                        <Text>{new Date(rental.end).toLocaleDateString()}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text>Price:</Text>
                                        <Text>{(rental.price / 10 ** 6).toLocaleString()} USD</Text>
                                    </HStack>
                                    <CancelFixedRentalButton rental={rental} />
                                </VStack>
                            ))
                        )
                            : (<Text>The are no rentals currently.</Text>)}
                    </Box> :

                    // Rental Management
                    <VStack spacing="2rem">
                        <Box>
                            <Text>Currently rentable: {isRentable.toString()}</Text>
                            <Text>Price per day: {(pricePerDay / 10 ** 6).toLocaleString()} USD</Text>
                        </Box>

                        <SetRentableButton tokenId={tokenId} />

                        <Box>
                            {fixedRentals.length > 0 ? (
                                fixedRentals.map((rental: any) => (
                                    <VStack key={rental.rentalId} p="1rem" border="1px solid black" spacing="1rem" rounded="xl">
                                        <HStack>
                                            <Text>Checkin Date:</Text>
                                            <Text>{new Date(rental.start).toLocaleDateString()}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text>Checkout Date:</Text>
                                            <Text>{new Date(rental.end).toLocaleDateString()}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text>Price:</Text>
                                            <Text>{(rental.price / 10 ** 6).toLocaleString()} USD</Text>
                                        </HStack>
                                        <ApproveFixedRentalButton rental={rental} />
                                    </VStack>
                                ))
                            )
                                : (<Text>The are no rentals currently.</Text>)}
                        </Box>
                    </VStack>
                }
            </VStack>

            <Divider />

            <VStack spacing="2rem">
                <Heading fontWeight="bold" fontSize="2xl">
                    Monthly Rental
                </Heading>

                {!sharesBalance ? monthlyRentals.length < 1 ? (
                    // Create monthly rental request
                    <VStack spacing="1rem">
                        <Text>Apply for monthly rent</Text>

                        <CreateMonthlyRentalButton
                            tokenId={tokenId}
                        />
                    </VStack>
                ) :
                    // User Rentals
                    <Box>
                        {userMonthlyRental ? (
                            <VStack p="1rem" border="1px solid black" spacing="1rem" rounded="xl">
                                <HStack>
                                    <Text>Start Date:</Text>
                                    <Text>{new Date(userMonthlyRental.start).toLocaleDateString()}</Text>
                                </HStack>

                                <HStack>
                                    <Text>Price per Month:</Text>
                                    <Text>{(pricePerMonth / 10 ** 6).toLocaleString()} USD</Text>
                                </HStack>

                                <CancelMonthlyRentalButton rental={userMonthlyRental} />
                            </VStack>
                        )
                            : (<Text>The are no rentals currently.</Text>)}
                    </Box> :

                    // Monthly Rental Management
                    <VStack spacing="2rem">
                        <Box>
                            <Text>Currently rentable: {isMonthlyRentable.toString()}</Text>
                            <Text>Price per month: {(pricePerMonth / 10 ** 6).toLocaleString()} USD</Text>
                        </Box>

                        <SetMonthlyRentableButton tokenId={tokenId} />

                        <Box>
                            {monthlyRentals.length > 0 ? (
                                monthlyRentals.map((rental: any) => (
                                    <VStack key={rental.rentalId} p="1rem" border="1px solid black" spacing="1rem" rounded="xl">
                                        <HStack>
                                            <Text fontWeight="bold">{rental.renter.slice(0, 5) + "..." + rental.renter.slice(39, 42)}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text>Check-In:</Text>
                                            <Text>{new Date(rental.start).toLocaleDateString()}</Text>
                                        </HStack>

                                        <ApproveMonthlyRentalButton rental={rental} />
                                    </VStack>
                                ))
                            )
                                : (<Text>The are no rentals currently.</Text>)}
                        </Box>
                    </VStack>
                }
            </VStack>
        </VStack>
    );
}
