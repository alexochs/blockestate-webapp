import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Button, Center, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>BlockEstate</title>
                <meta
                    name="description"
                    content="BlockEstate: An Ethereum-based Real Estate Protocol. Made by Alex Ochs."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Center h="80vh" flexDir="column">
                    <Flex>
                        <Heading fontSize="8xl">Block</Heading>
                        <Heading fontSize="8xl" color="blue.500">Estate</Heading>
                    </Flex>

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
