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

export default function BurnSharesButton({ tokenId, amount }: any) {
    const router = useRouter();
    const session = useSession();

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: sharesContractAddress,
        abi,
        functionName: "burnShares",
        args: [tokenId, amount],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useContractEvent({
        address: sharesContractAddress,
        abi,
        eventName: "TransferSingle",
        listener(operator, from, to, id, amount) {
            console.log("TransferSingle", operator, from, to, id, amount);
            if (
                (to == "0x0000000000000000000000000000000000000000" &&
                    from == session.data?.user?.address &&
                    id == tokenId,
                amount == amount)
            ) {
                router.push("/assets/" + tokenId);
            }
        },
    });

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!write || !session.data}
                isLoading={isLoading}
                colorScheme={"red"}
                border="rgb(0, 0, 0, 0.5)"
                rounded="full"
                onClick={() => {
                    write?.();
                }}
                size="lg"
            >
                {session.data ? `Burn Shares` : `Connect to burn Shares`}
            </Button>

            <Text>Shares: {amount}</Text>

            {isSuccess && <Text pt=".5rem">Successfully burned Shares!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
