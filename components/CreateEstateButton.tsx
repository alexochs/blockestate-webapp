import { Box, Button, Center, Text } from "@chakra-ui/react";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import { useSession } from "next-auth/react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { abi } from "../abi/BlockEstate.json";

export default function CreateEstateButton() {
  const session = useSession();

  const address = "0x32BC1f907DB63B0eeee3676fb72f31e3fE68d7FF";
  const functionName = "createEstate";

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args: ["Apartment", "Some Street 42"],
  });

  console.log(session);

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <Center flexDir={"column"}>
      <Button
        isDisabled={!write || !session.data}
        isLoading={isLoading}
        onClick={() => write?.()}
      >
        {session.data ? "Create Estate" : "Connect to create Estate"}
      </Button>
      {isSuccess && <Text pt=".5rem">Successfully created Estate!</Text>}
      {(isPrepareError || isError) && (
        <Text pt=".5rem">Error: {(prepareError || error)?.message}</Text>
      )}
    </Center>
  );
}
