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
} from "@chakra-ui/react";
import { useState } from "react";
import ListSharesButton from "@/components/Buttons/CreateSharesListingButton";

export default function ListSharesModal({
    tokenId,
    isOpen,
    onOpen,
    onClose,
}: any) {
    const [sharesBalance, setSharesBalance] = useState<number>(0);
    const [amount, setAmount] = useState<number>(1);
    const [price, setPrice] = useState<string>("1");

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sell your Shares</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing="1rem">
                        <Text textAlign={"start"} fontSize="4xl">
                            You hold <b>{sharesBalance}</b> Shares.
                        </Text>

                        <Center>
                            <Text textAlign={"start"} fontSize="xl" pr="2rem">
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
                            <Text textAlign={"start"} fontSize="xl" pr="2rem">
                                Price (MATIC)
                            </Text>

                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
