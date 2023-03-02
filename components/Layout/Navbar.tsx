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
    VStack,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FaHouseUser, FaMoon, FaUser, FaUserCircle, FaLanguage, FaChevronRight, FaCog, FaSignOutAlt } from "react-icons/fa";
import Auth from "../Auth";

export default function Navbar() {
    const router = useRouter();

    return (
        <Flex w="100vw" px="10vw" h="10vh" borderBottom="1px solid rgb(0, 0, 0, 0.1)" position="fixed" zIndex={1} backdropFilter={"blur(0.5rem)"} bg="rgb(255, 255, 255, 0.9)"
        >
            <Center flex={1}>
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Heading>
                        Block < span style={{ color: "#3182CE" }
                        }> Estate</span >
                    </Heading >
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
                                ? "solid"
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
                </HStack>
            </Center>

            <Center flex={1}>
                <Box cursor="pointer">
                    <Popover trigger="hover">
                        <PopoverTrigger>
                            <Button variant={"unstyled"}>
                                <Icon as={FaUserCircle} w="2.5rem" h="2.5rem" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent w="16rem" rounded="3xl">
                            <PopoverBody p="0">
                                <VStack spacing="0" align="start">
                                    <Link href="/user" w="100%" pl="1rem" py="1rem" roundedTop="3xl" _hover={{ bg: "gray.100" }}>
                                        <HStack spacing="1rem" >
                                            <Icon as={FaUser} w="1.5rem" h="1.5rem" />
                                            <Text fontWeight={"bold"} fontSize={["lg"]}>Profile</Text>
                                        </HStack>
                                    </Link>

                                    <Link href="/my-assets" w="100%" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                        <HStack spacing="1rem">
                                            <Icon as={FaHouseUser} w="1.5rem" h="1.5rem" />
                                            <Text fontWeight={"bold"} fontSize={["lg"]}>My Assets</Text>
                                        </HStack>
                                    </Link>

                                    <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                        <Icon as={FaCog} w="1.5rem" h="1.5rem" />
                                        <Text fontWeight={"bold"} fontSize={["lg"]}>Settings</Text>
                                    </HStack>

                                    <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }}>
                                        <Icon as={FaLanguage} w="1.5rem" h="1.5rem" />
                                        <Text fontWeight={"bold"} fontSize={["lg"]}>Language</Text>
                                        <Center>
                                            <Text fontWeight={"bold"} fontSize="sm">EN</Text>
                                            <Icon as={FaChevronRight} w=".75rem" h=".75rem" />
                                        </Center>
                                    </HStack>

                                    <HStack w="100%" spacing="1rem" pl="1rem" py="1rem" _hover={{ bg: "gray.100" }} onClick={() =>
                                        signOut({ redirect: true, callbackUrl: "/signin" })
                                    }>
                                        <Icon as={FaSignOutAlt} w="1.5rem" h="1.5rem" />
                                        <Text fontWeight={"bold"} fontSize={["lg"]}>Sign Out</Text>
                                    </HStack>

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
