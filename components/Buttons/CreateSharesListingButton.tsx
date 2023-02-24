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

export default function CreateSharesListingButton({
    tokenId,
    amount,
    price,
}: any) {
    console.log("CreateSharesListingButton", tokenId, amount, price);
    const router = useRouter();
    const session = useSession();

    const [isApprovedForAll, setIsApprovedForAll] = useState(false);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "createSharesListing",
        args: [tokenId, price * 10 ** 6, amount],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    const prepareApprovalForAll = usePrepareContractWrite({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "setApprovalForAll",
        args: [marketContractAddress, true],
    });

    const writeApprovalForAll = useContractWrite(prepareApprovalForAll.config);

    const {
        isLoading: approvalForAllLoading,
        isSuccess: approvalForAllSuccess,
    } = useWaitForTransaction({
        hash: writeApprovalForAll.data?.hash,
        onSuccess(data) {
            setIsApprovedForAll(data);
        },
    });

    const getIsApprovedForAll = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "isApprovedForAll",
        args: [session.data?.user?.address, marketContractAddress],
        watch: true,
        cacheTime: 2_000,
        onError: (error) => {
            console.log("isApprovedForAll() => ", error);
        },
        onSuccess: (data: any) => {
            console.log("approved: " + data);
            setIsApprovedForAll(data);
            console.log(session.data);
        },
    });

    return (
        <Center flexDir={"column"}>
            {isApprovedForAll ? (
                <Button
                    isDisabled={!write || !session.data}
                    isLoading={isLoading}
                    colorScheme={"blue"}
                    border="rgb(0, 0, 0, 0.5)"
                    rounded="full"
                    onClick={() => {
                        write?.();
                    }}
                    size="md"
                >
                    {session.data
                        ? `List your Shares`
                        : `Connect to list Shares`}
                </Button>
            ) : (
                <Button
                    isDisabled={!writeApprovalForAll.write || !session.data}
                    isLoading={approvalForAllLoading}
                    colorScheme={"blue"}
                    border="rgb(0, 0, 0, 0.5)"
                    rounded="full"
                    onClick={() => {
                        writeApprovalForAll.write?.();
                    }}
                    size="md"
                >
                    {session.data ? `Set Approval` : `Connect to list Shares`}
                </Button>
            )}

            {/*{isSuccess && <Text pt=".5rem">Successfully listed Shares!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    List Error: {(prepareError || error)?.message}
                </Text>
            )}*/}

            {approvalForAllSuccess && (
                <Text pt=".5rem">{/*Approval successful!*/}</Text>
            )}
            {(prepareApprovalForAll.error || prepareApprovalForAll.isError) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Approval Error:{" "}
                    {
                        (
                            prepareApprovalForAll.error ||
                            prepareApprovalForAll.error
                        )?.message
                    }
                </Text>
            )}
        </Center>
    );
}
