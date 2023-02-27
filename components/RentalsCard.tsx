import { Box, Heading, HStack, Input, Stack, VStack } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";
import CreateFixedRentalButton from "./Buttons/CreateFixedRentalButton";
import SetRentableButton from "./Buttons/SetRentableButton";

export default function RentalsCard({ tokenId }: any) {
    const [checkinDate, setCheckinDate] = useState<Date>(new Date());
    const [checkoutDate, setCheckoutDate] = useState<Date>(
        new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
    );

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

                <SingleDatepicker
                    name="checkin-date-input"
                    date={checkinDate}
                    onDateChange={setCheckinDate}
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

                <HStack>
                    <SetRentableButton tokenId={tokenId} />

                    <CreateFixedRentalButton
                        tokenId={tokenId}
                        checkinDate={checkinDate}
                        checkoutDate={checkoutDate}
                    />
                </HStack>
            </VStack>
        </Box>
    );
}
