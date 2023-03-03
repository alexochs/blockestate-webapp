import { Box, Button, Flex, HStack, Spacer, Stack, Stat, StatArrow, StatHelpText, Text, Link } from "@chakra-ui/react";

export default function AssetTrendingHero() {
    return (
        <Link cursor="pointer" style={{ textDecoration: "none" }}>
            <Box w="100%"
                rounded="3xl"
                h="65vh"
                bgImage={"url(https://cdn.fertighauswelt.de/85c04f5301d5d668cbbfb45e848a68a5ab7bfb6d/villa-bauen.jpg)"}
                bgSize="cover"
                boxShadow={"inset 0px 0px 1000px 10000px rgb(0,0,0,.25)"}
            >
                <Stack textAlign={"start"} px="2rem" top="25vh" bottom="0" spacing="2rem" color="whiteAlpha.900">
                    <Stack spacing="-1rem" pt="25vh">
                        <Text fontSize="7xl" fontWeight="bold">PACIFIC AVE 325</Text>
                        <Text fontSize="4xl" color="whiteAlpha.800">Los Angeles, USA</Text>
                    </Stack>

                    <Flex alignItems="center" w="75vw">
                        <HStack spacing="4rem">
                            <Stack spacing="-.25rem">
                                <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">Floor</Text>
                                <Text fontSize="2xl">13,420$</Text>
                                <Stat>
                                    <StatHelpText>
                                        <StatArrow type='increase' />
                                        5.36%
                                    </StatHelpText>
                                </Stat>
                            </Stack>

                            <Stack spacing="-.25rem">
                                <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">24h Volume</Text>
                                <Text fontSize="2xl">42,187$</Text>
                                <Stat>
                                    <StatHelpText>
                                        <StatArrow type='increase' />
                                        23.36%
                                    </StatHelpText>
                                </Stat>
                            </Stack>

                            <Stack spacing="-.25rem">
                                <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.800">Annual ROI</Text>
                                <Text fontSize="2xl">168%</Text>
                                <Stat>
                                    <StatHelpText>
                                        <StatArrow type='increase' />
                                        2.12%
                                    </StatHelpText>
                                </Stat>
                            </Stack>
                        </HStack>

                        <Spacer />

                        <Button size="lg" fontSize="xl" colorScheme={"whiteAlpha"} variant="solid" rounded="full">View Asset</Button>
                    </Flex>
                </Stack>
            </Box>
        </Link>
    );
}