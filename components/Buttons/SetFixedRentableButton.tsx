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

export default function SetFixedRentableButton({ tokenId, isRentable, pricePerDay }: any) {
    const session = useSession();
    const router = useRouter();

    const [initialRentable, setInitialRentable] = useState(isRentable);
    const [rentable, setRentable] = useState(isRentable);

    const [initialPrice, setInitialPrice] = useState(pricePerDay / 1e6);
    const [price, setPrice] = useState(pricePerDay / 1e6);

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "setRentable",
        args: [tokenId, rentable, price * 1e6],
    });

    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess: () => {
            setInitialRentable(rentable);
            setInitialPrice(price);
        },
    });

    return (
        <Center flexDir={"column"}>
            <FormControl id="rentable">
                <FormLabel>Rentable?</FormLabel>
                <RadioGroup
                    onChange={(value) => setRentable(value === "true")}
                    value={rentable.toString()}
                    size="lg"
                >
                    <HStack spacing="24px">
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                    </HStack>
                </RadioGroup>
            </FormControl>

            <FormControl id="price" pt="2rem">
                <FormLabel>Price per day (USD)</FormLabel>
                <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    rounded="full"
                    size="lg"
                    isDisabled={!rentable}
                />
            </FormControl>

            <Button
                isDisabled={!write || !session.data || (rentable == false && initialRentable == false) || (rentable == initialRentable && price == initialPrice)}
                isLoading={isLoading}
                onClick={() => write?.()}
                colorScheme="blue"
                rounded="full"
                variant="outline"
                mt="2rem"
            >
                Update
            </Button>

            {/*(isPrepareError || isError) && (
                <Text pt=".5rem" color="red" w="8rem">
                    {(prepareError || error)?.message}
                </Text>
            )*/}
        </Center>
    );
}
