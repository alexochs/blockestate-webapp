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
    useWriteContract,
    useSimulateContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "@/helpers/BlockEstateAssets.json";
import { assetsContractAddress } from "@/helpers/contractAddresses";
import { useEffect } from "react";
import { useRouter } from "next/router";
import confetti from "canvas-confetti";
import { Log } from 'viem';

type TransferLog = Log & {
    args: { from: string; tokenId: bigint };
};

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

    const { data: simulateData, error: prepareError } = useSimulateContract({
        address: assetsContractAddress,
        abi,
        functionName: "createAsset",
        args: [
            BigInt(category),
            String(street),
            BigInt(number),
            BigInt(category === 0 ? apNumber : 0),
            String(city),
            String(zip),
            String(country),
            BigInt(sharesOption),
        ],
    });

    const { writeContract, data: hash, error } = useWriteContract();

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
            router.push("/my-assets");
        }
    }, [isSuccess, router]);

    return (
        <Center flexDir={"column"}>
            <Button
                isDisabled={!session.data || !simulateData?.request}
                isLoading={isLoading}
                onClick={() => writeContract(simulateData!.request)}
                size="lg"
                colorScheme="blue"
                rounded="full"
            >
                {session.data ? "Create Asset" : "Connect to create Asset"}
            </Button>

            {isSuccess && <Text pt=".5rem">Successfully created Asset!</Text>}
            {(prepareError || error) && (
                <Text pt=".5rem" maxW={"90vw"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
