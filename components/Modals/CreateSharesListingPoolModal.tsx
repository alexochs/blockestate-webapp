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

export default function CreateSharesListingPoolModal({
    tokenId,
    sharesBalance,
    isOpen,
    onClose,
}: any) {
    const [amount, setAmount] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="3xl">
                <ModalHeader fontSize="4xl">Sell your Shares</ModalHeader>
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

                        <Center>
                            <Text textAlign={"start"} fontSize="lg" pr="2rem">
                                USD
                            </Text>

                            <Input
                                rounded="full"
                                size="lg"
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.valueAsNumber)
                                }
                            />
                        </Center>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <CreateSharesListingPoolButton
                        tokenId={tokenId}
                        amount={amount ? amount : 0}
                        price={price ? price : 0}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
