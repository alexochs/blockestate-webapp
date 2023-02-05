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

export default function CreateAssetButton() {
  const session = useSession();

  const address = "0x23C5D5eF6dC89aA0Db38509e63aE8bF8Dc5bf189";
  const functionName = "createAsset";

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args: [0, "Street", 1, "City", "Country"],
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
        {session.data ? "Create Asset" : "Connect to create Asset"}
      </Button>
      {isSuccess && <Text pt=".5rem">Successfully created Asset!</Text>}
      {(isPrepareError || isError) && (
        <Text pt=".5rem">Error: {(prepareError || error)?.message}</Text>
      )}
    </Center>
  );
}
