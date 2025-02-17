import { Box, Button, Center, Divider, Flex, Heading, Input, Link, SimpleGrid, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { assetsContractAddress, marketContractAddress, sharesContractAddress, usdTokenAddress } from "@/helpers/contractAddresses";
import { abi as sharesAbi } from "helpers/BlockEstateShares.json";
import { abi as assetsAbi } from "helpers/BlockEstateAssets.json";
import { abi as marketAbi } from "helpers/BlockEstateMarket.json";
import { abi as usdAbi } from "helpers/USDToken.json";
import { getSession } from "next-auth/react";
import { Asset } from "@/helpers/types";
import { readContract } from "@wagmi/core";
import AssetPreview from "@/components/AssetPreviewCard";
import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from "wagmi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { createPublicClient, http, Chain } from 'viem';
import { polygonAmoy } from "viem/chains";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    const client = createPublicClient({
        chain: polygonAmoy,
        transport: http()
    });

    const usdBalanceData = await client.readContract({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "balanceOf",
        args: [session.user?.address]
    });

    const fundsBalanceData = await client.readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "fundsPool",
        args: [session.user?.address]
    });

    const usdBalance = Number(usdBalanceData);
    const fundsBalance = Number(fundsBalanceData);

    return {
        props: {
            user: session.user,
            usdBalance,
            fundsBalance
        },
    };
}

export default function MyFundsPage({ user, usdBalance, fundsBalance }: any) {
    const router = useRouter();

    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [allowance, setAllowance] = useState(0);

    // Allowance
    const { data: allowanceData } = useReadContract({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "allowance",
        args: [user.address, marketContractAddress],
    });

    useEffect(() => {
        if (allowanceData) {
            setAllowance(Number(allowanceData));
        }
    }, [allowanceData]);

    // Approve
    const { data: approveSimulation } = useSimulateContract({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "approve",
        args: [marketContractAddress, BigInt(depositAmount * 1e6)],
    });

    const { writeContract: writeApprove, data: approveHash } = useWriteContract();

    const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    useEffect(() => {
        if (isApproved) {
            setAllowance(depositAmount * 1e6);
            router.reload();
        }
    }, [isApproved, depositAmount]);

    // Deposit
    const { data: depositSimulation } = useSimulateContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "deposit",
        args: [BigInt(depositAmount * 1e6)],
    });

    const { writeContract: writeDeposit, data: depositHash } = useWriteContract();

    const { isLoading: isDepositing, isSuccess: isDeposited } = useWaitForTransactionReceipt({
        hash: depositHash,
    });

    useEffect(() => {
        if (isDeposited) {
            router.reload();
        }
    }, [isDeposited]);

    // Withdraw
    const { data: withdrawSimulation } = useSimulateContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "withdraw",
        args: [BigInt(withdrawAmount * 1e6)],
    });

    const { writeContract: writeWithdraw, data: withdrawHash } = useWriteContract();

    const { isLoading: isWithdrawing, isSuccess: isWithdrawn } = useWaitForTransactionReceipt({
        hash: withdrawHash,
    });

    useEffect(() => {
        if (isWithdrawn) {
            router.reload();
        }
    }, [isWithdrawn]);

    // Render view

    return (
        <Box>
            <Head>
                <title>My Funds | ImmoVerse</title>
            </Head>

            <Heading fontSize="8xl" mb="2rem">My Funds</Heading>

            <Flex h="8rem" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                <Box w="50%" p="1rem">
                    <Heading>Wallet Balance</Heading>
                    <Text fontSize="xl" pt="1rem">{(usdBalance / 1e6).toLocaleString()} USD</Text>
                </Box>

                <Divider orientation="vertical" />

                <Box w="50%" p="1rem">
                    <Heading>Pool Balance</Heading>
                    <Text fontSize="xl" pt="1rem">{(fundsBalance / 1e6).toLocaleString()} USD</Text>
                </Box>
            </Flex>

            <Tabs mt="2rem" colorScheme="blue" border="1px solid rgb(0,0,0,0.2)" rounded="3xl">
                <TabList>
                    <Tab py="1rem" roundedTopLeft="3xl" fontWeight="bold" fontSize="xl" w="50%">Deposit into pool</Tab>
                    <Tab roundedTopRight="3xl" fontWeight="bold" fontSize="xl" w="50%">Withdraw from pool</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Box p="1rem">
                            <Center>
                                <Input
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    type="number"
                                    w="16rem"
                                    placeholder="Amount"
                                    size="lg"
                                    rounded="full"
                                />
                            </Center>

                            <Center pt="1rem">
                                {depositAmount && allowance < depositAmount * 1e6 ? (
                                    <Button
                                        size="lg"
                                        rounded="full"
                                        colorScheme="blue"
                                        w="16rem"
                                        isDisabled={!depositAmount || depositAmount <= 0 || !approveSimulation?.request}
                                        isLoading={isApproving}
                                        onClick={() => writeApprove(approveSimulation?.request)}
                                    >
                                        Approve
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        rounded="full"
                                        colorScheme="blue"
                                        w="16rem"
                                        isDisabled={!depositAmount || depositAmount <= 0 || !depositSimulation?.request}
                                        isLoading={isDepositing}
                                        onClick={() => writeDeposit(depositSimulation?.request)}
                                    >
                                        Deposit
                                    </Button>
                                )}
                            </Center>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box p="1rem">
                            <Center>
                                <Input
                                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                    type="number"
                                    w="16rem"
                                    placeholder="Amount"
                                    size="lg"
                                    rounded="full"
                                />
                            </Center>

                            <Center pt="1rem">
                                <Button
                                    size="lg"
                                    rounded="full"
                                    colorScheme="blue"
                                    w="16rem"
                                    isDisabled={!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > (fundsBalance / 1e6) || !withdrawSimulation?.request}
                                    isLoading={isWithdrawing}
                                    onClick={() => writeWithdraw(withdrawSimulation?.request)}
                                >
                                    Withdraw
                                </Button>
                            </Center>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}
