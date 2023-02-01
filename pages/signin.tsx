import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";

function SignIn() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  useEffect(() => {
    const handleAuth = async () => {
      const userData = { address, chain: chain?.id, network: "evm" };

      /*const { data } = await axios.post("/api/auth/request-message", userData, {
        headers: {
          "content-type": "application/json",
        },
      });*/

      //const message = data.message;
      const message = await requestChallengeAsync({
        address: userData.address as string,
        chainId: userData.chain as number,
      });

      const signature = await signMessageAsync({
        message: message?.message as string,
      });

      // redirect user after success authentication to '/user' page
      const response = await signIn("credentials", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/user",
      });

      if (!response) {
        return;
      }

      /**
       * instead of using signIn(..., redirect: "/user")
       * we get the url from callback and push it to the router to avoid page refreshing
       */
      push(response.url!);
    };
    if (status === "unauthenticated" && isConnected) {
      handleAuth();
    }
  }, [status, isConnected]);

  return (
    <div>
      <h3>Web3 Authentication</h3>
      <ConnectButton />
    </div>
  );
}

export default SignIn;
