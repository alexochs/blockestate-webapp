import { Center, Flex, Heading, HStack, Link, Text } from "@chakra-ui/react";
import Auth from "../Auth";

export default function Footer() {
    return (
        <Flex w="100vw" mt="5vh" py="2rem" px="5vw" h="5vh" borderTop="1px solid rgb(0, 0, 0, 0.1)" bg="gray.100">
            <Center flex={1}>
                <Link href="/">
                    <Text>© 2023 ImmoVerse</Text>
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
