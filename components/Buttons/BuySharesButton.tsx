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
import DeleteSharesListingButton from "./DeleteSharesListingButton";

export default function BuySharesButton({ listing }: any) {
    const router = useRouter();
    const session = useSession();

    const [allowance, setAllowance] = useState(0);

    console.log(listing.price);
    console.log("Allowance: ", allowance);

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
            setAllowance(parseInt(data._hex, 16));
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
        <Box>
            {session.data?.user?.address == listing.seller ?
                <DeleteSharesListingButton listing={listing} /> : allowance < listing.price ? (
                    <Button
                        isDisabled={!writeApproval.write || !session.data}
                        isLoading={txApproval.isLoading}
                        colorScheme={"blue"}
                        rounded="full"
                        variant={writeApproval.error ? "outline" : "solid"}
                        onClick={() => {
                            writeApproval.write?.();
                        }}
                        size="lg"
                        w="8rem"
                    >
                        {session.data
                            ? writeApproval.error
                                ? "Retry"
                                : `Approve`
                            : `Sign in`}
                    </Button>
                ) : (
                    <Button
                        isDisabled={!write || !session.data}
                        isLoading={isLoading}
                        colorScheme={"blue"}
                        rounded="full"
                        variant={isSuccess ? "outline" : "solid"}
                        onClick={() => {
                            write?.();
                        }}
                        size="lg"
                        w="8rem"
                    >
                        {session.data
                            ? isSuccess
                                ? `Success`
                                : `Buy`
                            : `Sign in`}
                    </Button>
                )}
        </Box>
    );
}
