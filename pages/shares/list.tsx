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
import ListSharesButton from "@/components/Buttons/CreateSharesListingButton";

export default function ListSharesPage() {
    const session = useSession();
    const router = useRouter();

    const { tokenId } = router.query;

    const [asset, setAsset] = useState<Asset | null>(null);
    const [sharesBalance, setSharesBalance] = useState<number>(0);
    const [amount, setAmount] = useState<number>(1);
    const [price, setPrice] = useState<string>("1");

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
        onError: (error) =>
            session.data?.user?.address
                ? router.push(`/shares`)
                : console.log("Not logged in!"),
        onSuccess: (data: any) => {
            setSharesBalance(parseInt(data._hex, 16));

            if (parseInt(data._hex, 16) < 1) {
                console.log("You are not a Shareholder of this Asset!");
                router.push(`/shares`);
            }
        },
    });

    return (
        <Box>
            <Heading fontSize="8xl" pb="2rem">
                Sell Shares
            </Heading>

            <VStack spacing="1rem">
                <Text textAlign={"start"} fontSize="4xl">
                    You hold <b>{sharesBalance}</b> Shares.
                </Text>

                <Center>
                    <Text textAlign={"start"} fontSize="xl" pr="2rem">
                        Amount
                    </Text>

                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) =>
                            setAmount(Math.floor(e.target.valueAsNumber))
                        }
                    />
                </Center>

                <Center>
                    <Text textAlign={"start"} fontSize="xl" pr="2rem">
                        Price (MATIC)
                    </Text>

                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Center>

                <Box pt="4rem">
                    <ListSharesButton
                        tokenId={tokenId}
                        amount={amount ? amount : 0}
                        price={price ? price : 0}
                    />
                </Box>
            </VStack>
        </Box>
    );
}
