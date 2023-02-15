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
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import {
    sharesContractAddress,
    marketContractAddress,
} from "@/helpers/contractAddresses";
import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

export default function DeleteSharesListingButton({ listing }: any) {
    const router = useRouter();
    const session = useSession();

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "deleteSharesListing",
        args: [listing.listingId],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.push("/market");
        },
    });

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!write || !session.data}
                isLoading={isLoading}
                colorScheme={"red"}
                variant="ghost"
                border="rgb(0, 0, 0, 0.5)"
                rounded="xl"
                onClick={() => {
                    write?.();
                }}
            >
                {session.data ? `Delete Listing` : `Connect to delete Listing`}
            </Button>

            {isSuccess && <Text pt=".5rem">Successfully deleted Listing!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
