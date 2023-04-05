import { marketContractAddress, usdTokenAddress } from "@/helpers/contractAddresses";
import { abi as marketAbi } from "helpers/BlockEstateMarket.json";
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Switch,
    Text,
    Image,
    VStack,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaHouseUser, FaMoon, FaUser, FaUserCircle, FaLanguage, FaChevronRight, FaCog, FaSignOutAlt, FaHome, FaSign, FaSignInAlt, FaPiggyBank, FaFaucet, FaMoneyBillWave } from "react-icons/fa";
import { GiIsland } from "react-icons/gi";
import { BsSafeFill } from "react-icons/bs";
import { useAccount, useBalance, useContractRead, useEnsAvatar, useEnsName } from "wagmi";
import Auth from "../Auth";

export default function Navbar({ account }: any) {
    const session = useSession();
    const router = useRouter();

    const [fundsBalance, setFundsBalance] = useState(0);
    const getAllowance = useContractRead({
        address: marketContractAddress,
        abi: marketAbi,
        functionName: "fundsPool",
        args: [session.data?.user?.address],
        onError: (error: any) => {
            console.log("fundsPool() error => ", error);
        },
        onSuccess: (data: any) => {
            setFundsBalance(parseInt(data._hex, 16));
        },
    });

    return (
        <Flex roundedBottom="full" w="100vw" px="10vw" h="10vh" borderBottom="1px solid rgb(0, 0, 0, 0.1)" position="fixed" zIndex={1} backdropFilter={"blur(0.5rem)"} bg="rgb(255, 255, 255, 0.9)"
        >
            <Center flex={1}>
                <Link href="/" style={{ textDecoration: "none" }}>
                    <HStack>
                        {/*<Icon as={FaHome} w="3rem" h="3rem" bg="blue.500" p=".35rem" rounded="full" color="white" />*/}
                        <Flex>
                            <Heading>
                                Immo
                            </Heading >
                            <Heading color="cyan.400">
                                Verse
                            </Heading >
                        </Flex>
                    </HStack>
                </Link >
            </Center >

            <Center flex={1}>
                <HStack spacing="4rem">
                    <Link href="/invest" style={{ textDecoration: "none" }}>
                        <Button
                            color={router.asPath.includes("/invest")
                                ? "blue.500"
                                : ""}
                            rounded="full"
                            variant={router.asPath.includes("/invest")
                                ? "outline"
                                : "ghost"}
                            fontWeight={
                                router.asPath.includes("/invest")
                                    ? "bold"
                                    : "normal"
                            }
                        >
                            Invest
                        </Button>
                    </Link>

                    <Link href="/rent" style={{ textDecoration: "none" }}>
                        <Button
                            color={router.asPath.includes("/rent")
                                ? "blue.500"
                                : ""}
                            rounded="full"
                            variant={router.asPath.includes("/rent")
                                ? "outline"
                                : "ghost"}
                            fontWeight={
                                router.asPath.includes("/rent")
                                    ? "bold"
                                    : "normal"
                            }
                        >
                            Rent
                        </Button>
                    </Link>
                </HStack>
            </Center>

            <Center flex={1}>
                <Box cursor="pointer">
                    <Popover trigger="hover">
                        <PopoverTrigger>
                            {session?.data?.user?.address ?
                                <Button h="3rem" variant="ghost" colorScheme={"blue"} rounded="full">
                                    <HStack spacing=".5rem">
                                        <Text>{(fundsBalance / 1e6).toLocaleString() + "$"}</Text>

                                        <Image
                                            src="https://profile-images.xing.com/images/e680d104f7fba5c447b9e687dd9bc5ef-3/paul-misar.1024x1024.jpg"
                                            w="3rem"
                                            h="3rem"
                                            rounded="full"
                                        />

                                        <Text>{session?.data?.user?.address ? session?.data?.user?.address?.slice(2, 8) : "..."}</Text>
                                    </HStack>
                                </Button> :
                                <Box>
                                    <IconButton aria-label="profile icon" as={FaUserCircle} w="3rem" h="3rem" rounded="full" color="gray.600" />
                                </Box>}
                        </PopoverTrigger>
                        <PopoverContent w="16rem" rounded="3xl">
                            <PopoverBody p="0">
                                <VStack spacing="0" align="start">
                                    {session?.data?.user?.address ?
                                        <Link href={"/profiles/" + session?.data?.user?.address} w="100%" pl="1rem" py="1rem" roundedTop="3xl" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem" >
                                                <Icon as={FaUser} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>My Profile</Text>
                                            </HStack>
                                        </Link> :
                                        <Link href="/signin" w="100%" pl="1rem" py="1rem" roundedTop="3xl" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem" >
                                                <Icon as={FaSignInAlt} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>Sign in</Text>
                                            </HStack>
                                        </Link>}

                                    {session?.data?.user?.address &&
                                        <Link href="/my-funds" w="100%" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem">
                                                <Icon as={BsSafeFill} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>My Funds</Text>
                                            </HStack>
                                        </Link>}

                                    {session?.data?.user?.address &&
                                        <Link href="/my-assets" w="100%" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem">
                                                <Icon as={FaHouseUser} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>My Assets</Text>
                                            </HStack>
                                        </Link>}

                                    {session?.data?.user?.address &&
                                        <Link href="/my-rentals" w="100%" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem">
                                                <Icon as={GiIsland} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>My Rentals</Text>
                                            </HStack>
                                        </Link>}

                                    {session?.data?.user?.address && false &&
                                        <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                            <Icon as={FaCog} w="1.5rem" h="1.5rem" />
                                            <Text fontWeight={"bold"} fontSize={["lg"]}>Settings</Text>
                                        </HStack>}

                                    {session?.data?.user?.address &&
                                        <Link href="/faucet" w="100%" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem">
                                                <Icon as={FaFaucet} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>Faucet</Text>
                                            </HStack>
                                        </Link>}

                                    <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                        <Icon as={FaLanguage} w="1.5rem" h="1.5rem" />
                                        <Text fontWeight={"bold"} fontSize={["lg"]}>Language</Text>
                                        <Center>
                                            <Text fontWeight={"bold"} fontSize="sm">EN</Text>
                                            <Icon as={FaChevronRight} w=".75rem" h=".75rem" />
                                        </Center>
                                    </HStack>

                                    {session?.data?.user?.address && <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }} onClick={() =>
                                        signOut({ redirect: true, callbackUrl: "/signin" })
                                    }>
                                        <Icon as={FaSignOutAlt} w="1.5rem" h="1.5rem" />
                                        <Text fontWeight={"bold"} fontSize={["lg"]}>Sign Out</Text>
                                    </HStack>}

                                    <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" roundedBottom={"3xl"} _hover={{ bg: "gray.100" }}>
                                        <Icon as={FaMoon} w="1.5rem" h="1.5rem" />
                                        <Text fontWeight={"bold"} fontSize={["lg"]}>Dark Mode</Text>
                                        <Switch />
                                    </HStack>
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>

                {/*<Auth />*/}
            </Center>
        </Flex >
    );
}
