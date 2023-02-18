import { Button, Center, Heading } from "@chakra-ui/react";
import { getSession, signOut } from "next-auth/react";

// gets a prop from getServerSideProps
function User({ user }: any) {
    return (
        <Center h="80vh" flexDir="column">
            <Heading fontSize="8xl">Hello 👋</Heading>
            <Heading pb="2rem">{user.address}</Heading>

            <Button
                rounded="xl"
                colorScheme="red"
                variant="ghost"
                onClick={() =>
                    signOut({ redirect: true, callbackUrl: "/signin" })
                }
            >
                Sign out
            </Button>
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
