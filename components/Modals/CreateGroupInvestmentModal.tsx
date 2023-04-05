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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ListSharesButton from "@/components/Buttons/CreateSharesListingButton";
import { useSession } from "next-auth/react";
import { SharesListing } from "@/helpers/types";
import CreateGroupInvestmentButton from "../Buttons/CreateGroupInvestmentButton";

export default function CreateGroupInvestmentModal({
    listing,
    isOpen,
    onClose,
}: any) {
    const session = useSession();

    const [investors, setInvestors] = useState<string[]>([
        session.data?.user?.address!
    ]);
    const [sharesAmounts, setSharesAmounts] = useState<number[]>([
        listing ? listing.amount : 0,
    ]);

    useEffect(() => {
        if (listing) {
            setInvestors([session.data?.user!.address!]);
            setSharesAmounts([listing.amount]);
        }
    }, [listing]);

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="3xl">
                <ModalHeader fontSize="4xl">
                    Create a group investment
                </ModalHeader>
                <ModalCloseButton rounded="full" />
                <ModalBody pb={6}>
                    <VStack spacing="1rem">
                        {investors.map((investor, index) => {
                            return (
                                <HStack key={index} w="90%">
                                    <Input
                                        border="1px solid rgb(0, 0, 0, 0.4)"
                                        rounded="full"
                                        w="65%"
                                        placeholder="Recipient Address"
                                        type={"text"}
                                        value={investor}
                                        onChange={(e) =>
                                            setInvestors(
                                                investors.map((address, i) =>
                                                    i == index
                                                        ? e.target.value
                                                        : address
                                                )
                                            )
                                        }
                                    />

                                    <Input
                                        border="1px solid rgb(0, 0, 0, 0.4)"
                                        rounded="full"
                                        w="25%"
                                        placeholder="Amount"
                                        type={"number"}
                                        value={sharesAmounts[index]}
                                        onChange={(e) =>
                                            setSharesAmounts(
                                                sharesAmounts.map((amount, i) =>
                                                    i == index
                                                        ? e.target.valueAsNumber
                                                        : amount
                                                )
                                            )
                                        }
                                    />

                                    {index > 0 && (
                                        <Button
                                            onClick={() => {
                                                setInvestors(
                                                    investors.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );

                                                setSharesAmounts(
                                                    sharesAmounts.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                            }}
                                            colorScheme={"red"}
                                            border="rgb(0, 0, 0, 0.5)"
                                            rounded="full"
                                            variant={"ghost"}
                                            fontSize="sm"
                                        >
                                            X
                                        </Button>
                                    )}
                                </HStack>
                            );
                        })}

                        <Button
                            color="rgb(0, 0, 0, 0.5)"
                            variant="ghost"
                            rounded="full"
                            onClick={() => {
                                setInvestors([...investors, ""]);
                                setSharesAmounts([...sharesAmounts, 1]);
                            }}
                        >
                            Add Recipient
                        </Button>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <CreateGroupInvestmentButton
                        listing={listing}
                        investors={investors}
                        sharesAmounts={sharesAmounts}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
