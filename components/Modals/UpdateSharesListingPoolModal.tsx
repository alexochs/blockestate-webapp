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
} from "@chakra-ui/react";
import { useState } from "react";
import ListSharesButton from "@/components/Buttons/CreateSharesListingButton";
import CreateSharesListingPoolButton from "../Buttons/CreateSharesListingPoolButton";
import WithdrawSharesListingPoolButton from "../Buttons/WithdrawSharesListingPoolButton";
import DepositSharesListingPoolButton from "../Buttons/DepositSharesListingPoolButton";

export default function UpdateSharesListingPoolModal({
    sharesListingPoolId,
    isOpen,
    onClose,
}: any) {
    const [amount, setAmount] = useState<number>(1);

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="3xl">
                <ModalHeader fontSize="4xl">Update Listing Pool</ModalHeader>
                <ModalCloseButton rounded="full" />
                <ModalBody pb={6}>
                    <VStack spacing="1rem">
                        <Center>
                            <Text textAlign={"start"} fontSize="lg" pr="2rem">
                                Amount
                            </Text>

                            <Input
                                rounded="full"
                                size="lg"
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        Math.floor(e.target.valueAsNumber)
                                    )
                                }
                            />
                        </Center>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <WithdrawSharesListingPoolButton
                        sharesListingPoolId={sharesListingPoolId}
                        amount={amount ? amount : 0}
                    />
                    <Box pr="1rem" />
                    <DepositSharesListingPoolButton
                        sharesListingPoolId={sharesListingPoolId}
                        amount={amount ? amount : 0}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
