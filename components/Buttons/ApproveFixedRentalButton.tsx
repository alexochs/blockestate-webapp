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
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { abi as usdAbi } from "@/helpers/USDToken.json";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import {
    assetsContractAddress,
    rentalsContractAddress,
    usdTokenAddress,
} from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FixedRental } from "@/helpers/types";

export default function ApproveFixedRentalButton({
    rental
}: {
    rental: FixedRental;
}) {
    const session = useSession();
    const router = useRouter();

    const alreadyVoted = rental.approved.includes(session?.data?.user?.address!);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "approveFixedRental",
        args: [rental.rentalId],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.reload();
        }
    });

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!write || !session.data || alreadyVoted}
                isLoading={isLoading}
                onClick={() => write?.()}
                colorScheme="blue"
                rounded="full"
                variant="solid"
                size="lg"
            >
                {rental.isApproved ? "Approved" : alreadyVoted ? "Voted" : "Vote for approval"}
            </Button>

            {/*isSuccess && <Text pt=".5rem">Successfully voted your approve!</Text>*/}
            {/*(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"32rem"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )*/}
        </Center>
    );
}
