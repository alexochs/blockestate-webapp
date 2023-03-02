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
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import {
    assetsContractAddress,
    rentalsContractAddress,
} from "@/helpers/contractAddresses";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SetMonthlyRentableButton({ tokenId }: any) {
    const session = useSession();
    const router = useRouter();

    const [rentable, setRentable] = useState(false);
    const [price, setPrice] = useState(0);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "setMonthlyRentable",
        args: [tokenId, rentable, price * 10 ** 6],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    return (
        <Center flexDir={"column"}>
            <FormControl id="rentable">
                <FormLabel>Rentable?</FormLabel>
                <RadioGroup
                    onChange={(value) => setRentable(value === "true")}
                    value={rentable.toString()}
                >
                    <HStack spacing="24px">
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                    </HStack>
                </RadioGroup>
            </FormControl>

            {rentable && <FormControl id="price" pt="1rem">
                <FormLabel>Price per month (USD)</FormLabel>
                <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                />
            </FormControl>}

            <Button
                isDisabled={!write || !session.data}
                isLoading={isLoading}
                onClick={() => write?.()}
                colorScheme="blue"
                rounded="full"
                variant="outline"
                mt="1rem"
            >
                Update
            </Button>

            {(isPrepareError || isError) && (
                <Text pt=".5rem" maxW={"8rem"}>
                    Error: {(prepareError || error)?.message}
                </Text>
            )}
        </Center>
    );
}
