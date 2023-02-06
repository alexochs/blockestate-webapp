import { Center, Flex, Heading, HStack, Link, Text } from "@chakra-ui/react";
import Auth from "../Auth";

export default function Footer() {
    return (
        <Flex w="100vw" px="5vw" h="5vh">
            <Center flex={1}>
                <Link href="/">
                    <Text>BlockEstate © 2023</Text>
                </Link>
            </Center>

            <Center flex={1}>
                <Link href="https://alexochs.de">
                    <Text>Made with 💙 by Alex Ochs</Text>
                </Link>
            </Center>
        </Flex>
    );
}
