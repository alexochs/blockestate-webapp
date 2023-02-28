import { Box, Heading, HStack, Input, Stack, VStack, Text } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CreateFixedRentalButton from "./Buttons/CreateFixedRentalButton";
import SetRentableButton from "./Buttons/SetRentableButton";

export default function RentalsCard({ tokenId, sharesBalance, fixedRentals }: any) {
    console.log(fixedRentals);
    const session = useSession();
    const userRentals = fixedRentals.filter((rental: any) => rental.renter === session.data?.user?.address);

    const [checkinDate, setCheckinDate] = useState<Date>(new Date());
    const [checkoutDate, setCheckoutDate] = useState<Date>(
        new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
    );

    const handleCheckinChange = (date: Date) => {
        setCheckinDate(date);
        if (date.getTime() > checkoutDate.getTime()) {
            setCheckoutDate(new Date(date.getTime() + 60 * 60 * 24 * 1000));
        }
    }

    return (
        <Box
            rounded={"3xl"}
            border={"1px solid rgb(100, 100, 100)"}
            bgGradient="linear(to-br, rgb(255, 255, 255, 0.2), rgb(255, 255, 255, 0.1))"
            backdropFilter={"blur(0.25rem)"}
            mx="1rem"
            p="1.5rem"
        >
            <VStack spacing="1rem">
                <Heading fontWeight="bold" fontSize="2xl">
                    Rentals
                </Heading>

                {!sharesBalance ? userRentals.length < 1 ? (
                    // Create rental
                    <VStack spacing="1rem">
                        <SingleDatepicker
                            name="checkin-date-input"
                            date={checkinDate}
                            onDateChange={handleCheckinChange}
                            minDate={new Date(new Date().setHours(0, 0, 0, 0))}
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
                    // User Rentals
                    <Box>
                        {userRentals.length > 0 ? (
                            userRentals.map((rental: any) => (
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
                                </VStack>
                            ))
                        )
                            : (<Text>The are no rentals currently.</Text>)}
                    </Box> :

                    // Rental Management
                    <VStack spacing="2rem">
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
                                    </VStack>
                                ))
                            )
                                : (<Text>The are no rentals currently.</Text>)}
                        </Box>
                    </VStack>
                }
            </VStack>
        </Box>
    );
}
