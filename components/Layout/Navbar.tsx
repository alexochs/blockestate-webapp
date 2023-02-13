import { Center, Flex, Heading, HStack, Link, Text } from "@chakra-ui/react";
import Auth from "../Auth";

export default function Navbar() {
    return (
        <Flex w="100vw" px="10vw" h="10vh">
            <Center flex={1}>
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Heading>
                        Block<span style={{ color: "#3182CE" }}>Estate</span>
                    </Heading>
                </Link>
            </Center>

            <Center flex={1}>
                <HStack spacing="4rem">
                    <Link href="/assets">
                        <Text>Assets</Text>
                    </Link>
                    <Link href="/market">
                        <Text>Market</Text>
                    </Link>
                </HStack>
            </Center>

            <Center flex={1}>
                <Auth />
            </Center>
        </Flex>
    );
}
