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
import { abi } from "@/helpers/BlockEstateMarket.json";
import { marketContractAddress } from "@/helpers/contractAddresses";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateAssetListingButton({ tokenId, price }: any) {
    const router = useRouter();
    const session = useSession();
    const functionName = "createAssetListing";

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: marketContractAddress,
        abi,
        functionName,
        args: [tokenId, price],
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
                onClick={() => write?.()}
                size="lg"
                colorScheme="blue"
                rounded="full"
                border="1px solid black"
            >
                {session.data ? "Create Listing" : "Connect to create Listing"}
            </Button>

            {isSuccess && (
                <Text pt=".5rem">Successfully created Asset Listing!</Text>
            )}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
