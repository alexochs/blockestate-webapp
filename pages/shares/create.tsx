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
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContractRead } from "wagmi";
import {
    assetsContractAddress,
    sharesContractAddress,
} from "@/helpers/contractAddresses";
import { abi } from "@/helpers/BlockEstateAssets.json";
import CreateSharesButton from "@/components/Buttons/CreateSharesButton";

export default function CreateSharesPage() {
    const session = useSession();
    const router = useRouter();

    const { tokenId } = router.query;

    const [asset, setAsset] = useState<Asset | null>(null);
    const [assetOwner, setAssetOwner] = useState<string>("");
    const [recipients, setRecipients] = useState<string[]>([
        session.data?.user!.address,
    ]);
    const [amounts, setAmounts] = useState<number[]>([1]);

    const readAsset = useContractRead({
        address: assetsContractAddress,
        abi,
        functionName: "readAsset",
        args: [tokenId],
        onSuccess: (data) => setAsset(Asset.fromSingleEntry(data)),
    });

    const ownerOf = useContractRead({
        address: assetsContractAddress,
        abi,
        functionName: "ownerOf",
        args: [tokenId],
        onError: (error) => router.push(`/shares`),
        onSuccess: (data: any) => {
            setAssetOwner(data);

            if (data !== session?.data?.user?.address) {
                console.log("You are not the owner of this asset!");
                router.push(`/shares`);
            }
        },
    });

    return (
        <Box>
            <Heading fontSize="8xl" pb="2rem">
                Create Shares
            </Heading>

            <VStack spacing="1rem">
                <Heading textAlign={"start"}>Recipients</Heading>
                {recipients.map((recipient, index) => {
                    return (
                        <HStack w="90%">
                            <Input
                                border="1px solid rgb(0, 0, 0, 0.4)"
                                rounded="xl"
                                w="65%"
                                placeholder="Recipient Address"
                                type={"text"}
                                value={recipients[index]}
                                onChange={(e) =>
                                    setRecipients(
                                        recipients.map((address, i) =>
                                            i == index
                                                ? e.target.value
                                                : address
                                        )
                                    )
                                }
                            />

                            <Input
                                border="1px solid rgb(0, 0, 0, 0.4)"
                                rounded="xl"
                                w="25%"
                                placeholder="Amount"
                                type={"number"}
                                value={amounts[index]}
                                onChange={(e) =>
                                    setAmounts(
                                        amounts.map((amount, i) =>
                                            i == index
                                                ? e.target.valueAsNumber
                                                : amount
                                        )
                                    )
                                }
                            />

                            {index > 0 && (
                                <Button
                                    onClick={() => {
                                        setRecipients(
                                            recipients.filter(
                                                (_, i) => i !== index
                                            )
                                        );
                                    }}
                                    colorScheme={"red"}
                                    border="rgb(0, 0, 0, 0.5)"
                                    rounded="xl"
                                >
                                    X
                                </Button>
                            )}
                        </HStack>
                    );
                })}

                <Button
                    color="rgb(0, 0, 0, 0.5)"
                    variant="ghost"
                    rounded="xl"
                    onClick={() => {
                        setRecipients([...recipients, ""]);
                        setAmounts([...amounts, 1]);
                    }}
                >
                    Add Recipient
                </Button>
            </VStack>

            <Center pt="8rem">
                <CreateSharesButton
                    tokenId={tokenId}
                    recipients={recipients}
                    amounts={amounts}
                />
            </Center>
        </Box>
    );
}
