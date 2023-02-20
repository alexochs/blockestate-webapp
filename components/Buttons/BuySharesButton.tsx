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
import { abi as usdTokenAbi } from "@/helpers/USDToken.json";
import {
    sharesContractAddress,
    marketContractAddress,
    usdTokenAddress,
} from "@/helpers/contractAddresses";
import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";

export default function BuySharesButton({ listing }: any) {
    const router = useRouter();
    const session = useSession();

    const [allowance, setAllowance] = useState(0);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "purchaseSharesListing",
        args: [listing.listingId],
        onError: (error) => {
            console.log("preparePurchaseShares() => ", error);
        },
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    const getAllowance = useContractRead({
        address: usdTokenAddress,
        abi: usdTokenAbi,
        functionName: "allowance",
        args: [session.data?.user?.address, marketContractAddress],
        onError: (error) => {
            console.log("allowance() => ", error);
        },
        onSuccess: (data: any) => {
            setAllowance(data);
        },
    });

    const prepareApproval = usePrepareContractWrite({
        address: usdTokenAddress,
        abi: usdTokenAbi,
        functionName: "approve",
        args: [marketContractAddress, listing.price],
        onError: (error) => {
            console.log("prepareApproval() => ", error);
        },
    });

    const writeApproval = useContractWrite(prepareApproval.config);

    const txApproval = useWaitForTransaction({
        hash: writeApproval.data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    return (
        <Center flexDir={"column"}>
            {allowance < listing.price ? (
                <Button
                    isDisabled={!writeApproval.write || !session.data}
                    isLoading={txApproval.isLoading}
                    colorScheme={"blue"}
                    rounded="full"
                    onClick={() => {
                        writeApproval.write?.();
                    }}
                    size="md"
                >
                    {session.data
                        ? writeApproval.error
                            ? "Error"
                            : `Approve`
                        : `Connect to buy`}
                </Button>
            ) : (
                <Button
                    isDisabled={!write || !session.data}
                    isLoading={isLoading}
                    colorScheme={"blue"}
                    rounded="full"
                    onClick={() => {
                        write?.();
                    }}
                    size="md"
                >
                    {session.data
                        ? isSuccess
                            ? `Success`
                            : `Buy`
                        : `Connect to buy`}
                </Button>
            )}
        </Center>
    );
}
