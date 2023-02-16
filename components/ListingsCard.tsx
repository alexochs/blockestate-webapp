import { SharesListing } from "@/helpers/types";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
    Box,
    Stack,
    Spacer,
    Flex,
    Text,
    Input,
    Button,
    IconButton,
    HStack,
    Center,
    Divider,
    Link,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import ListSharesModal from "./ListSharesModal";

export default function ListingsCard({
    sharesBalance,
    sharesTotalSupply,
}: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // get listings
    const [listings, setListings] = useState<SharesListing[]>([]);

    return (
        <Box
            mx="1rem"
            p="1.5rem"
            rounded={"3xl"}
            border={"1px solid rgb(100, 100, 100)"}
            bgGradient="linear(to-br, rgb(255, 255, 255, 0.2), rgb(255, 255, 255, 0.1))"
            backdropFilter={"blur(0.25rem)"}
            position="sticky"
            top={"20vh"}
        >
            <Stack spacing={"1rem"}>
                <Text>
                    You own {sharesBalance} out of {sharesTotalSupply} (
                    {((sharesBalance / sharesTotalSupply) * 100).toFixed(2)}%)
                    Share
                    {sharesTotalSupply > 1 ? "s" : ""}.
                </Text>

                <Divider />

                <VStack spacing="1rem">
                    <Flex>
                        <HStack spacing="1rem">
                            <Text fontWeight="bold" fontSize="2xl">
                                Listings
                            </Text>

                            <Button
                                fontSize="sm"
                                size="sm"
                                colorScheme={"blue"}
                                variant="ghost"
                                rounded="2xl"
                                onClick={onOpen}
                            >
                                Sell your Shares
                            </Button>
                        </HStack>
                    </Flex>

                    <VStack align={"start"} spacing="1rem">
                        <HStack spacing="1rem">
                            <Box>
                                <Text fontSize="lg">
                                    42 Shares @ $13,337.00
                                </Text>
                                <Text fontSize="xs">
                                    ${(42 * 13337).toLocaleString()}
                                </Text>
                            </Box>

                            <Button
                                variant="outline"
                                colorScheme="blue"
                                rounded="xl"
                            >
                                Buy
                            </Button>
                        </HStack>

                        <HStack spacing="1rem">
                            <Box>
                                <Text fontSize="lg">
                                    11 Shares @ $19,420.00
                                </Text>
                                <Text fontSize="xs">
                                    ${(11 * 19420).toLocaleString()}
                                </Text>
                            </Box>

                            <Button
                                variant="outline"
                                colorScheme="blue"
                                rounded="xl"
                            >
                                Buy
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </Stack>

            <ListSharesModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}
