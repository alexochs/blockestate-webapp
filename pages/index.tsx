import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Button, Center, Heading, Link } from "@chakra-ui/react";

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
                <Center h="80vh">
                    <Heading fontSize="8xl">Welcome to BlockEstate!</Heading>
                </Center>
            </main>
        </>
    );
}
