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
    useSimulateContract,
    useWaitForTransactionReceipt,
    useReadContract,
    useWriteContract,
} from "wagmi";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import {
    sharesContractAddress,
    marketContractAddress,
} from "@/helpers/contractAddresses";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

export default function CreateSharesListingPoolButton({
    tokenId,
    amount,
    price,
}: any) {
    const router = useRouter();
    const session = useSession();

    const [isApprovedForAll, setIsApprovedForAll] = useState(false);

    const { data: simulateData } = useSimulateContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "createSharesListingPool",
        args: [BigInt(tokenId), BigInt(amount), BigInt(price * 1e6)],
    });

    const { data: simulateApprovalData, error: simulateError } = useSimulateContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "setApprovalForAll",
        args: [marketContractAddress, true],
    });

    const { writeContract, data: hash } = useWriteContract();

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const { data: isApprovedForAllData } = useReadContract({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "isApprovedForAll",
        args: [session.data?.user?.address, marketContractAddress],
    });

    useEffect(() => {
        if (isApprovedForAllData !== undefined) {
            setIsApprovedForAll(Boolean(isApprovedForAllData));
        }
    }, [isApprovedForAllData]);

    useEffect(() => {
        if (isSuccess) {
            router.reload();
        }
    }, [isSuccess, router]);

    return (
        <Center flexDir={"column"}>
            {isApprovedForAll ? (
                <Button
                    isDisabled={!simulateData?.request}
                    isLoading={isLoading}
                    colorScheme={"blue"}
                    border="rgb(0, 0, 0, 0.5)"
                    rounded="full"
                    onClick={() => {
                        writeContract(simulateData!.request);
                    }}
                    size="lg"
                >
                    {session.data
                        ? `List your Shares`
                        : `Connect to list Shares`}
                </Button>
            ) : (
                <Button
                    isDisabled={!simulateApprovalData?.request || !session.data}
                    isLoading={isLoading}
                    colorScheme={"blue"}
                    border="rgb(0, 0, 0, 0.5)"
                    rounded="full"
                    onClick={() => writeContract(simulateApprovalData!.request)}
                    size="lg"
                >
                    {session.data ? `Set Approval` : `Connect to list Shares`}
                </Button>
            )}

            {isSuccess && <Text pt=".5rem">Successfully listed Shares!</Text>}
            {simulateError && (
                <Text pt=".5rem" maxW={"90vw"}>
                    List Error: {simulateError.message}
                </Text>
            )}

            {isSuccess && (
                <Text pt=".5rem">{/*Approval successful!*/}</Text>
            )}
            {simulateError && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Approval Error: {simulateError.message}
                </Text>
            )}
        </Center>
    );
}
