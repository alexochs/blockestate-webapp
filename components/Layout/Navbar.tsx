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
import { FaHouseUser, FaMoon, FaUser, FaUserCircle, FaLanguage, FaChevronRight, FaCog, FaSignOutAlt, FaHome, FaSign, FaSignInAlt } from "react-icons/fa";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import Auth from "../Auth";

export default function Navbar({ account }: any) {
    const session = useSession();
    const router = useRouter();

    return (
        <Flex roundedBottom="full" w="100vw" px="10vw" h="10vh" borderBottom="1px solid rgb(0, 0, 0, 0.1)" position="fixed" zIndex={1} backdropFilter={"blur(0.5rem)"} bg="rgb(255, 255, 255, 0.9)"
        >
            <Center flex={1}>
                <Link href="/" style={{ textDecoration: "none" }}>
                    <HStack>
                        <Icon as={FaHome} w="3rem" h="3rem" bg="blue.500" p=".35rem" rounded="full" color="white" />
                        <Flex>
                            <Heading>
                                Block
                            </Heading >
                            <Heading color="blue.500">
                                Estate
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
                                        <Image
                                            src="https://yt3.ggpht.com/_cHyQKa7gmPyFY61sKrYV50KMvqhrfcYZ9XqahIOXqlLwc2bBv1bUgPUwGaPwYtzheXOP8-j=s600-c-k-c0x00ffffff-no-rj-rp-mo"
                                            w="3rem"
                                            h="3rem"
                                            rounded="full"
                                            ml="-2rem"
                                        />
                                        <Text>{session?.data?.user?.address ? session?.data?.user?.address?.slice(2, 8) : "..."}</Text>
                                    </HStack>
                                </Button> :
                                <Icon as={FaUserCircle} w="3rem" h="3rem" rounded="full" color="gray.600" />}
                        </PopoverTrigger>
                        <PopoverContent w="16rem" rounded="3xl">
                            <PopoverBody p="0">
                                <VStack spacing="0" align="start">
                                    {session?.data?.user?.address ?
                                        <Link href="/user" w="100%" pl="1rem" py="1rem" roundedTop="3xl" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem" >
                                                <Icon as={FaUser} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>Profile</Text>
                                            </HStack>
                                        </Link> :
                                        <Link href="/user" w="100%" pl="1rem" py="1rem" roundedTop="3xl" _hover={{ bg: "gray.100" }}>
                                            <HStack spacing="1rem" >
                                                <Icon as={FaSignInAlt} w="1.5rem" h="1.5rem" />
                                                <Text fontWeight={"bold"} fontSize={["lg"]}>Sign in</Text>
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
                                        <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                            <Icon as={FaCog} w="1.5rem" h="1.5rem" />
                                            <Text fontWeight={"bold"} fontSize={["lg"]}>Settings</Text>
                                        </HStack>}

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
