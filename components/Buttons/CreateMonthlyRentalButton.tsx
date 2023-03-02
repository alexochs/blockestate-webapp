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

export default function CreateMonthlyRentalButton({
    tokenId,
}: any) {
    const session = useSession();
    const router = useRouter();

    const [allowance, setAllowance] = useState(1_000_000 * 10 ** 6);

    // createMonthlyRental 

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "createMonthlyRental",
        args: [tokenId, Math.round((Date.now() + 24 * 360 * 1000) / 1000)],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.reload();
        }
    });

    // USD allowance

    const getAllowance = useContractRead({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "allowance",
        args: [session.data?.user?.address, rentalsContractAddress],
        onError: (error: any) => {
            console.log("allowance() error => ", error);
        },
        onSuccess: (data: any) => {
            console.log("allowance() success => ", data);
            setAllowance(data);
        },
    });

    // calculate allowance for rental contract, also add to allowance instead of setting it
    const {
        config: allowanceConfig,
        error: prepareAllowanceError,
        isError: isPrepareAllowanceError,
    } = usePrepareContractWrite({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "approve",
        args: [rentalsContractAddress, 100_000 * 10 ** 6],
    });

    const { data: writeAllowanceData, error: writeAllowanceError, isError: writeAllowanceIsError, write: writeAllowance } = useContractWrite(allowanceConfig);

    const { isLoading: txAllowanceLoading, isSuccess: txAllowanceSuccess } = useWaitForTransaction({
        hash: writeAllowanceData?.hash,
        onSuccess: () => {
            setAllowance(100_000 * 10 ** 6);
        }
    });

    // useEffect

    useEffect(() => {
        if (isSuccess) {
            router.replace("/assets");
        }
    }, [isSuccess]);

    // render

    return (
        <Center flexDir={"column"}>
            {allowance >= 0 * 10 ** 6 ?
                <Button
                    isDisabled={!write || !session.data}
                    isLoading={isLoading}
                    onClick={() => write?.()}
                    colorScheme="blue"
                    rounded="full"
                    variant="solid"
                >
                    Apply for rental
                </Button> :
                <Button
                    isDisabled={!writeAllowance || !session.data}
                    isLoading={txAllowanceLoading}
                    onClick={() => writeAllowance?.()}
                    colorScheme="blue"
                    rounded="full"
                    variant="outline"
                >
                    Approve USD
                </Button>}

            {isSuccess && <Text pt=".5rem">Successfully requested rental!</Text>}
            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"32rem"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
