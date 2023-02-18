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

export default function ListSharesModal({
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
            <ModalContent>
                <ModalHeader fontSize="4xl">Sell your Shares</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing="1rem">
                        <Center>
                            <Text textAlign={"start"} fontSize="lg" pr="2rem">
                                Amount
                            </Text>

                            <Input
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
                    <ListSharesButton
                        tokenId={tokenId}
                        amount={amount ? amount : 0}
                        price={price ? price : 0}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
