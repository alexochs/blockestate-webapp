import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Button, Center, Flex, Heading, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>ImmoVerse</title>
                <meta
                    name="description"
                    content="ImmoVerse: An Ethereum-based Real Estate Protocol. Made by Alex Ochs."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Center h="80vh" flexDir="column">
                    <HStack spacing="1rem">
                        {/*<Icon as={FaHome} w="8rem" h="8rem" bg="blue.500" p=".75rem" rounded="full" color="white" />*/}
                        <Flex>
                            <Heading fontSize="8xl">
                                Immo
                            </Heading >
                            <Heading color="cyan.400" fontSize="8xl">
                                Verse
                            </Heading >
                        </Flex>
                    </HStack>

                    <VStack spacing=".5rem" fontSize="3xl" pt="2rem" color="gray.600">
                        <Text>Invest in real estate.</Text>
                        <Text>Find your new home.</Text>
                        <Text>100% on-chain.</Text>
                    </VStack>
                </Center>
            </main>
        </>
    );
}
