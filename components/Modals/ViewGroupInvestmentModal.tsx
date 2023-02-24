import {
    Box,
    Button,
    Center,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
    Text,
    Flex,
    HStack,
    Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ListSharesButton from "@/components/Buttons/CreateSharesListingButton";
import { useSession } from "next-auth/react";
import { SharesListing } from "@/helpers/types";
import CreateGroupInvestmentButton from "../Buttons/CreateGroupInvestmentButton";
import {
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import {
    usdTokenAddress,
    marketContractAddress,
} from "@/helpers/contractAddresses";
import { abi as usdTokenAbi } from "@/helpers/USDToken.json";
import { abi as marketAbi } from "@/helpers/BlockEstateMarket.json";
import { useRouter } from "next/router";

export default function ViewGroupInvestmentModal({
    listing,
    groupInvestment,
    isOpen,
    onClose,
}: any) {
    const router = useRouter();
    const session = useSession();

    const [userPrice, setUserPrice] = useState(0);
    const [allowance, setAllowance] = useState(0);

    // USD Token Allowance and Approval

    const getAllowance = useContractRead({
        address: usdTokenAddress,
        abi: usdTokenAbi,
        functionName: "allowance",
        args: [session.data?.user?.address, marketContractAddress],
        watch: true,
        cacheTime: 2_000,
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
        args: [marketContractAddress, userPrice ? userPrice : 0],
        onError: (error) => {
            console.log("prepareApproval() => ", error);
        },
    });

    const writeApproval = useContractWrite(prepareApproval.config);

    const txApproval = useWaitForTransaction({
        hash: writeApproval.data?.hash,
        onSuccess: () => {
            //router.reload();
        },
    });

    // Accept Group Investment

    const prepareAccept = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "acceptGroupInvestment",
        args: [groupInvestment?.investmentId],
        onError: (error) => {
            console.log("acceptGroupInvestment() => ", error);
        },
    });

    const writeAccept = useContractWrite(prepareAccept.config);

    const txAccept = useWaitForTransaction({
        hash: writeAccept.data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    // Revoke Group Investment Acceptance

    const prepareRevoke = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "revokeGroupInvestment",
        args: [groupInvestment?.investmentId],
        onError: (error) => {
            console.log("revokeGroupInvestment() => ", error);
        },
    });

    const writeRevoke = useContractWrite(prepareRevoke.config);

    const txRevoke = useWaitForTransaction({
        hash: writeRevoke.data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    // Refuse Group Investment

    const prepareRefuse = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "refuseGroupInvestment",
        args: [groupInvestment?.investmentId],
        onError: (error) => {
            console.log("refuseGroupInvestment() => ", error);
        },
    });

    const writeRefuse = useContractWrite(prepareRefuse.config);

    const txRefuse = useWaitForTransaction({
        hash: writeRefuse.data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    useEffect(() => {
        if (!groupInvestment || !listing) return;

        for (let i = 0; i < groupInvestment.investors.length; i++) {
            if (groupInvestment.investors[i] === session.data?.user?.address) {
                setUserPrice(
                    (listing.price / listing.amount) *
                        parseInt(groupInvestment.sharesAmounts[i].hex, 16)
                );
            }
        }
    }, [groupInvestment, listing, session.data?.user?.address]);

    if (!listing || !groupInvestment) return null;

    console.log(groupInvestment);

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="3xl">
                <ModalHeader fontSize="4xl">
                    Group Investment #{groupInvestment.investmentId}
                </ModalHeader>
                <ModalCloseButton rounded="full" />
                <ModalBody pb={6}>
                    <VStack spacing="4rem">
                        <VStack spacing="1rem">
                            <Heading fontSize="2xl">Investors</Heading>
                            <VStack spacing=".5rem">
                                {groupInvestment.investors.map(
                                    (investor: any, index: number) => (
                                        <Box key={index} textAlign="start">
                                            <Text>
                                                <b>{investor}</b>
                                            </Text>
                                            <Text>
                                                Shares:{" "}
                                                {parseInt(
                                                    groupInvestment
                                                        .sharesAmounts[index]
                                                        .hex,
                                                    16
                                                )}
                                            </Text>
                                            <Text>
                                                Investment:{" "}
                                                {(
                                                    ((listing.price /
                                                        listing.amount) *
                                                        parseInt(
                                                            groupInvestment
                                                                .sharesAmounts[
                                                                index
                                                            ].hex,
                                                            16
                                                        )) /
                                                    10 ** 6
                                                ).toLocaleString()}{" "}
                                                USD
                                            </Text>
                                            <Text>
                                                Accepted:{" "}
                                                {groupInvestment.accepted.includes(
                                                    investor
                                                )
                                                    ? "Yes"
                                                    : "No"}
                                            </Text>
                                        </Box>
                                    )
                                )}
                            </VStack>
                        </VStack>

                        <VStack spacing="1rem">
                            <Heading fontSize="2xl">Allowance</Heading>
                            <Box>
                                You need to set an allowance for the market
                                contract to transfer your USD tokens on
                                purchase.
                            </Box>
                            <Button
                                isDisabled={
                                    allowance >= userPrice ||
                                    txApproval.isError ||
                                    !writeApproval.write
                                }
                                isLoading={txApproval.isLoading}
                                onClick={() => writeApproval.write?.()}
                                rounded="full"
                                colorScheme="blue"
                                variant="outline"
                            >
                                Allow
                            </Button>
                        </VStack>

                        <VStack spacing="1rem">
                            <Heading fontSize="2xl">Accept</Heading>
                            <Box>
                                Accept the group investment. Purchase will be
                                automatically fulfilled once every investor has
                                accepted.
                            </Box>
                            <HStack spacing="1rem">
                                {groupInvestment.accepted.includes(
                                    session?.data?.user?.address
                                ) ? (
                                    <Button
                                        rounded="full"
                                        size="sm"
                                        variant="outline"
                                        colorScheme="red"
                                        isDisabled={
                                            allowance < userPrice ||
                                            txRevoke.isError ||
                                            !writeRevoke.write
                                        }
                                        isLoading={txRevoke.isLoading}
                                        onClick={() => writeRevoke.write?.()}
                                    >
                                        Revoke
                                    </Button>
                                ) : (
                                    <Button
                                        rounded="full"
                                        colorScheme="blue"
                                        isDisabled={
                                            allowance < userPrice ||
                                            txAccept.isError ||
                                            !writeAccept.write
                                        }
                                        isLoading={txAccept.isLoading}
                                        onClick={() => writeAccept.write?.()}
                                    >
                                        Accept
                                    </Button>
                                )}

                                <Button
                                    rounded="full"
                                    size="sm"
                                    colorScheme="red"
                                    variant={"ghost"}
                                    isDisabled={
                                        txRefuse.isError || !writeRefuse.write
                                    }
                                    isLoading={txRefuse.isLoading}
                                    onClick={() => writeRefuse.write?.()}
                                >
                                    Refuse
                                </Button>
                                <Text>
                                    {prepareRefuse.isError
                                        ? prepareRefuse.error?.message
                                        : ""}
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
}
