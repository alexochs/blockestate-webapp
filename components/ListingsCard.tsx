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
} from "@chakra-ui/react";
import { useState } from "react";

export default function ListingsCard({
    sharesBalance,
    sharesTotalSupply,
}: any) {
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
            </Stack>
        </Box>
    );
}
