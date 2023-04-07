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
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }

    const usdBalanceData = (await readContract({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "balanceOf",
        args: [session.user?.address]
    })) as any;
    const usdBalance = parseInt(usdBalanceData._hex, 16);

    const fundsBalanceData = (await readContract({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "fundsPool",
        args: [session.user?.address]
    })) as any;
    const fundsBalance = parseInt(fundsBalanceData._hex, 16);

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

    // Allowance / Approval

    const getAllowance = useContractRead({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "allowance",
        args: [user.address, marketContractAddress],
        onError: (error) => {
            console.log("allowance() => ", error);
        },
        onSuccess: (data: any) => {
            setAllowance(parseInt(data._hex, 16));
        },
    });

    const prepareApproval = usePrepareContractWrite({
        address: usdTokenAddress,
        abi: usdAbi,
        functionName: "approve",
        args: [marketContractAddress, depositAmount * 1e6],
        onError: (error) => {
            console.log("prepareApproval() => ", error);
        },
    });

    const writeApproval = useContractWrite(prepareApproval.config);

    const txApproval = useWaitForTransaction({
        hash: writeApproval.data?.hash,
        onSuccess: () => {
            router.reload(); // fix this later, deposit throws allowance error even after successful approval
            setAllowance(depositAmount * 1e6);
        },
    });

    // Deposit

    const prepareDeposit = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "deposit",
        args: [depositAmount * 1e6],
        cacheTime: 1_000,
        onError: (error) => {
            console.log("prepareDeposit() => ", error);
        },
    });

    const writeDeposit = useContractWrite(prepareDeposit.config);

    const txDeposit = useWaitForTransaction({
        hash: writeDeposit.data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

    // Withdraw

    const prepareWithdraw = usePrepareContractWrite({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "withdraw",
        args: [withdrawAmount * 1e6],
        onError: (error) => {
            console.log("prepareWithdraw() => ", error);
        },
    });

    const writeWithdraw = useContractWrite(prepareWithdraw.config);

    const txWithdraw = useWaitForTransaction({
        hash: writeWithdraw.data?.hash,
        onSuccess: () => {
            router.reload();
        },
    });

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
                                <Input onChange={(e: any) => setDepositAmount(e.target.valueAsNumber)} type="number" w="16rem" placeholder="Amount" size="lg" rounded="full" />
                            </Center>

                            <Center pt="1rem">
                                {depositAmount && allowance < depositAmount * 1e6 ? (
                                    <Button
                                        size="lg"
                                        rounded="full"
                                        colorScheme={"blue"}
                                        w="16rem"
                                        isDisabled={!depositAmount ||
                                            depositAmount <= 0 ||
                                            allowance >= depositAmount * 1e6 ||
                                            txApproval.isLoading ||
                                            prepareApproval.isError
                                        }
                                        isLoading={txApproval.isLoading}
                                        onClick={() => writeApproval.write?.()}
                                    >
                                        Approve
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        rounded="full"
                                        colorScheme={"blue"}
                                        w="16rem"
                                        isDisabled={!depositAmount ||
                                            allowance < depositAmount * 1e6 ||
                                            depositAmount <= 0 ||
                                            txDeposit.isSuccess
                                        }
                                        isLoading={txDeposit.isLoading}
                                        onClick={() => writeDeposit.write?.()}
                                    >
                                        Deposit
                                    </Button>)}
                            </Center>

                            {prepareApproval.isError && (
                                <Text pt="1rem" textAlign={"center"} color="red.500">{prepareApproval.error?.message}</Text>
                            )}

                            {prepareDeposit.isError && (
                                <Text pt="1rem" textAlign={"center"} color="red.500">{prepareDeposit.error?.message}</Text>
                            )}
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box p="1rem">
                            <Center>
                                <Input onChange={(e: any) => setWithdrawAmount(e.target.valueAsNumber)} type="number" w="16rem" placeholder="Amount" size="lg" rounded="full" />
                            </Center>

                            <Center pt="1rem">
                                <Button
                                    size="lg"
                                    rounded="full"
                                    colorScheme={"blue"}
                                    w="16rem"
                                    isDisabled={!withdrawAmount ||
                                        withdrawAmount <= 0 ||
                                        withdrawAmount > (fundsBalance / 1e6) ||
                                        txWithdraw.isSuccess
                                    }
                                    isLoading={txWithdraw.isLoading}
                                    onClick={() => writeWithdraw.write?.()}
                                >
                                    Withdraw
                                </Button>
                            </Center>

                            {prepareWithdraw.isError && (
                                <Text pt="1rem" textAlign={"center"} color="red.500">{prepareWithdraw.error?.message}</Text>
                            )}
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}
