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
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import {
    sharesContractAddress,
    marketContractAddress,
} from "@/helpers/contractAddresses";
import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

export default function BuySharesButton({ listing }: any) {
    const router = useRouter();
    const session = useSession();

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "purchaseSharesListing",
        args: [listing.listingId],
        overrides: {
            value: listing.price.toString(),
        },
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    /*useContractEvent({
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
                const _id = id as any;
                router.push(`/assets/${parseInt(_id._hex, 16)}}`);
            }
        },
    });*/

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!write || !session.data}
                isLoading={isLoading}
                colorScheme={"blue"}
                border="rgb(0, 0, 0, 0.5)"
                rounded="xl"
                onClick={() => {
                    write?.();
                }}
                size="lg"
            >
                {session.data ? `Buy Shares` : `Connect to buy Shares`}
            </Button>

            {isSuccess && <Text pt=".5rem">Successfully bought Shares!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {prepareError?.message}
                </Text>
            )}
        </Center>
    );
}
