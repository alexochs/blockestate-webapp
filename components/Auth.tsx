import { Button, Spinner } from "@chakra-ui/react";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useSession, signOut } from "next-auth/react";

export default function Auth() {
    const session = useSession();
    const router = useRouter();

    return session.status == "loading" ? (
        <Spinner size="md" />
    ) : session.status == "unauthenticated" ? (
        <Button
            rounded="full"
            colorScheme="blue"
            onClick={() => router.push("/signin")}
        >
            Connect
        </Button>
    ) : (
        <Button
            onClick={() => router.push("/profiles/" + session.data?.user?.address)}
            rounded="full"
            colorScheme="blue"
            variant="outline"
        >
            {session.data?.user?.address.slice(0, 8) + "..."}
        </Button>
    );
}
