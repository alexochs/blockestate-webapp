import { Asset } from "@/helpers/types";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    VStack,
    Text,
    useNumberInput,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContractRead } from "wagmi";
import {
    assetsContractAddress,
    sharesContractAddress,
} from "@/helpers/contractAddresses";
import { abi as sharesAbi } from "@/helpers/BlockEstateShares.json";
import { abi as assetsAbi } from "@/helpers/BlockEstateAssets.json";
import BurnSharesButton from "@/components/Buttons/BurnSharesButton";

export default function BurnSharesPage() {
    const session = useSession();
    const router = useRouter();

    const { tokenId } = router.query;

    const [asset, setAsset] = useState<Asset | null>(null);
    const [sharesBalance, setSharesBalance] = useState<number>(0);
    const [amount, setAmount] = useState<number>(1);

    const readAsset = useContractRead({
        address: assetsContractAddress,
        abi: assetsAbi,
        functionName: "readAsset",
        args: [tokenId],
        onSuccess: (data) => setAsset(Asset.fromSingleEntry(data)),
    });

    const balanceOf = useContractRead({
        address: sharesContractAddress,
        abi: sharesAbi,
        functionName: "balanceOf",
        args: [session.data?.user?.address, tokenId],
        onError: (error) => router.push(`/shares`),
        onSuccess: (data: any) => {
            setSharesBalance(parseInt(data._hex, 16));

            if (parseInt(data._hex, 16) < 1) {
                console.log("You do not hold any Share of that Asset!");
                router.push(`/shares`);
            }
        },
    });

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            defaultValue: 1,
            min: 1,
            max: sharesBalance,
        });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    return (
        <Box>
            <Heading fontSize="8xl" pb="2rem">
                Burn Shares
            </Heading>

            <VStack spacing="1rem">
                <Text textAlign={"start"} fontSize="4xl">
                    You hold <b>{sharesBalance}</b> Shares.
                </Text>

                <Center>
                    <Button variant="ghost" rounded="xl" mr="1rem" {...dec}>
                        -
                    </Button>

                    <Input w="25%" {...input} />

                    <Button
                        ml="1rem"
                        variant="ghost"
                        rounded="xl"
                        mr="1rem"
                        {...inc}
                    >
                        +
                    </Button>
                </Center>

                <Box pt="4rem">
                    <BurnSharesButton tokenId={tokenId} amount={amount} />
                </Box>
            </VStack>
        </Box>
    );
}
