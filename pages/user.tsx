import { Button, Center, Heading, Text } from "@chakra-ui/react";
import { getSession, signOut } from "next-auth/react";

// gets a prop from getServerSideProps
function User({ user }: any) {
    return (
        <Center h="70vh" flexDir="column">
            <Heading fontSize="8xl">Hello 👋</Heading>

            <Text pt="2rem" pb="2rem" fontSize="4xl">{user.address.slice(0, 8) + "..."}</Text>
        </Center>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    return {
        props: { user: session.user },
    };
}

export default User;
