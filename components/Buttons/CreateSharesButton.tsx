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
    useContractEvent,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { abi } from "@/helpers/BlockEstateShares.json";
import { sharesContractAddress } from "@/helpers/contractAddresses";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateSharesButton({
    tokenId,
    recipients,
    amounts,
}: any) {
    const router = useRouter();
    const session = useSession();

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: sharesContractAddress,
        abi,
        functionName: "createSharesBatch",
        args: [tokenId, recipients, amounts],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!write || !session.data}
                isLoading={isLoading}
                colorScheme={"blue"}
                border="rgb(0, 0, 0, 0.5)"
                rounded="full"
                onClick={() => {
                    console.log(recipients);
                    console.log(amounts);
                    write?.();
                }}
                size="lg"
            >
                {session.data ? "Create Shares" : "Connect to create Shares"}
            </Button>

            {isSuccess && <Text pt=".5rem">Successfully created Shares!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
