import { Button, Center, Heading, Text } from "@chakra-ui/react";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";

// gets a prop from getServerSideProps
function User({ user, account }: any) {
    console.log(user);
    console.log(account);

    return (
        <>
            <Head>
                <title>{account.slice(0, 8) + " | ImmoVerse"}</title>
            </Head>

            {user && user.address === account ? (
                <Center h="70vh" flexDir="column">
                    <Heading fontSize="8xl">Hello 👋</Heading>
                    <Text pt="2rem" pb="2rem" fontSize="4xl">{user.address.slice(0, 8) + "..."}</Text>
                </Center>
            ) : (
                <Center h="70vh" flexDir="column">
                    <Heading fontSize="8xl">Profile</Heading>
                    <Text pt="2rem" pb="2rem" fontSize="4xl">{account.slice(0, 8) + "..."}</Text>
                </Center>
            )}
        </>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    const { account } = context.params;

    return {
        props: {
            user: session?.user ? session?.user : null,
            account
        },
    };
}

export default User;
