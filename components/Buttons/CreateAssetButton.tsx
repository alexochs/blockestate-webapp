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
import { abi } from "@/helpers/BlockEstateAssets.json";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateAssetButton({
    category,
    street,
    apNumber,
    number,
    city,
    zip,
    country,
    sharesOption,
}: any) {
    const router = useRouter();
    const session = useSession();
    const functionName = "createAsset";

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: assetsContractAddress,
        abi,
        functionName,
        args: [
            category,
            street,
            number,
            apNumber,
            city,
            zip,
            country,
            sharesOption,
        ],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useContractEvent({
        address: assetsContractAddress,
        abi,
        eventName: "Transfer",
        listener(from, to, tokenId) {
            console.log("Transfer", from, to, tokenId);
            if (from == "0x0000000000000000000000000000000000000000") {
                const _tokenId = tokenId as any;
                router.push(`/invest/${parseInt(_tokenId._hex)}`);
            }
        },
    });

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!session.data}
                isLoading={isLoading}
                onClick={() => write?.()}
                size="lg"
                colorScheme="blue"
                rounded="full"
            >
                {session.data ? "Create Asset" : "Connect to create Asset"}
            </Button>

            {isSuccess && <Text pt=".5rem">Successfully created Asset!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
