import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Radio,
    RadioGroup,
    Text,
} from "@chakra-ui/react";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import { useSession } from "next-auth/react";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { abi } from "@/helpers/BlockEstate.json";
import address from "@/helpers/contractAddress";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CreateAssetButton({ tokenId }: any) {
    const session = useSession();
    const router = useRouter();

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address,
        abi,
        functionName: "deleteAsset",
        args: [tokenId],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useEffect(() => {
        if (isSuccess) {
            router.replace("/assets");
        }
    }, [isSuccess]);

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!write || !session.data}
                isLoading={isLoading}
                onClick={() => write?.()}
                colorScheme="red"
                rounded="xl"
            >
                Delete Asset
            </Button>

            {isSuccess && <Text pt=".5rem">Successfully deleted Asset!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
