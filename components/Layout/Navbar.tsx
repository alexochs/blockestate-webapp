import {
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Link,
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Auth from "../Auth";

export default function Navbar() {
    const router = useRouter();

    return (
        <Flex w="100vw" px="10vw" h="10vh">
            <Center flex={1}>
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Heading>
                        Block<span style={{ color: "#3182CE" }}>Estate</span>
                    </Heading>
                </Link>
            </Center>

            <Center flex={1}>
                <HStack spacing="4rem">
                    <Link href="/assets" style={{ textDecoration: "none" }}>
                        <Button
                            rounded="full"
                            variant={"ghost"}
                            fontWeight={
                                router.asPath.includes("/assets")
                                    ? "bold"
                                    : "normal"
                            }
                        >
                            Assets
                        </Button>
                    </Link>
                </HStack>
            </Center>

            <Center flex={1}>
                <Auth />
            </Center>
        </Flex>
    );
}
