import { Button } from "@chakra-ui/react";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useSession, signOut } from "next-auth/react";

export default function Auth() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const session = useSession();
  const router = useRouter();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const { message }: any = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });

    const { url }: any = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: router.pathname,
    });

    router.push(url);
  };

  return !session.data ? (
    <Button onClick={handleAuth}>Connect</Button>
  ) : (
    <Button onClick={() => signOut()}>
      {session.data.user!.address.slice(0, 8) + "..."}
    </Button>
  );
}
