import { Center, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import Auth from "./Auth";

export default function Navbar() {
  return (
    <Flex w="100vw" px="10vw" h="5vh">
      <Center>
        <Heading>BlockEstate</Heading>
      </Center>

      <Center ml="1rem">
        <Auth />
      </Center>
    </Flex>
  );
}
