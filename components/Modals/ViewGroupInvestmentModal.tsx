import {
    Box,
    Button,
    Center,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
    Text,
    Flex,
    HStack,
    Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ListSharesButton from "@/components/Buttons/CreateSharesListingButton";
import { useSession } from "next-auth/react";
import { SharesListing } from "@/helpers/types";
import CreateGroupInvestmentButton from "../Buttons/CreateGroupInvestmentButton";
import { useContractRead } from "wagmi";
import {
    usdTokenAddress,
    marketContractAddress,
} from "@/helpers/contractAddresses";
import { abi as usdTokenAbi } from "@/helpers/USDToken.json";

export default function ViewGroupInvestmentModal({
    listing,
    groupInvestment,
    isOpen,
    onClose,
}: any) {
    const session = useSession();

    const [allowance, setAllowance] = useState(0);

    const getAllowance = useContractRead({
        address: usdTokenAddress,
        abi: usdTokenAbi,
        functionName: "allowance",
        args: [session.data?.user?.address, marketContractAddress],
        onError: (error) => {
            console.log("allowance() => ", error);
        },
        onSuccess: (data: any) => {
            setAllowance(parseInt(data._hex, 16));
        },
    });

    if (!listing || !groupInvestment) return null;

    console.log(groupInvestment);

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="3xl">
                <ModalHeader fontSize="4xl">
                    Group Investment #{groupInvestment.investmentId}
                </ModalHeader>
                <ModalCloseButton rounded="full" />
                <ModalBody pb={6}>
                    <VStack spacing="4rem">
                        <VStack spacing="1rem">
                            <Heading fontSize="2xl">Investors</Heading>
                            <VStack spacing=".5rem">
                                {groupInvestment.investors.map(
                                    (investor: any, index: number) => (
                                        <Box key={index} textAlign="start">
                                            <Text>
                                                <b>{investor}</b>
                                            </Text>
                                            <Text>
                                                Shares:{" "}
                                                {parseInt(
                                                    groupInvestment
                                                        .sharesAmounts[index]
                                                        .hex,
                                                    16
                                                )}
                                            </Text>
                                            <Text>
                                                Investment:{" "}
                                                {(
                                                    ((listing.price /
                                                        listing.amount) *
                                                        parseInt(
                                                            groupInvestment
                                                                .sharesAmounts[
                                                                index
                                                            ].hex,
                                                            16
                                                        )) /
                                                    10 ** 6
                                                ).toLocaleString()}{" "}
                                                USD
                                            </Text>
                                            <Text>
                                                Accepted:{" "}
                                                {groupInvestment.accepted.includes(
                                                    investor
                                                )
                                                    ? "Yes"
                                                    : "No"}
                                            </Text>
                                        </Box>
                                    )
                                )}
                            </VStack>
                        </VStack>

                        <VStack spacing="1rem">
                            <Heading fontSize="2xl">Allowance</Heading>
                            <Box>
                                You need to set an allowance for the market
                                contract to transfer your USD tokens on
                                purchase.
                            </Box>
                            <Button
                                isDisabled={allowance >= listing.price}
                                rounded="full"
                                colorScheme="blue"
                                variant="outline"
                            >
                                Allow
                            </Button>
                        </VStack>

                        <VStack spacing="1rem">
                            <Heading fontSize="2xl">Accept</Heading>
                            <Box>
                                Accept the group investment. Purchase will be
                                automatically fulfilled once every investor has
                                accepted.
                            </Box>
                            <Button
                                rounded="full"
                                colorScheme="blue"
                                isDisabled={allowance < listing.price}
                            >
                                Accept
                            </Button>
                        </VStack>
                    </VStack>
                </ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
}
