import { Center, Flex, Heading, HStack, Link, Spacer, Text } from "@chakra-ui/react";
import Auth from "../Auth";

export default function Footer() {
    return (
        <Flex flexDir={["column", "row"]} w="100vw" mt="5vh" py="2rem" px="5vw" minH="5vh">
            <Center flex={1}>
                <Link href="https://immover.se">
                    <Text>© 2023 ImmoVerse</Text>
                </Link>
            </Center>

            <Center flex={1}>
                <Link href="https://alexochs.de" target="_blank">
                    <Text>Made with 💙 by Alex Ochs</Text>
                </Link>
            </Center>
        </Flex>
    );
}
