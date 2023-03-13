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
import { BigNumber, ethers } from "ethers";
import DeleteSharesListingButton from "./DeleteSharesListingButton";

export default function PurchaseFromSharesListingPoolButton({ sharesListingPool, amount }: any) {
    const router = useRouter();
    const session = useSession();

    const [fundsPoolBalance, setFundsPoolBalance] = useState(0);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "purchaseFromSharesListingPool",
        args: [sharesListingPool.sharesListingPoolId, amount],
        onError: (error) => {
            console.log("purchaseFromSharesListingPool() => ", error);
        },
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    const getFundsPoolBalance = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "fundsPool",
        args: [session?.data?.user?.address],
        onSuccess: (result: BigNumber) => {
            setFundsPoolBalance(parseInt(result._hex, 16));
        }
    });

    return (
        <Box>
            <Button
                isDisabled={!write || !session.data || isSuccess}
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
                        : `Purchase`
                    : `Sign in`}
            </Button>
        </Box >
    );
}
