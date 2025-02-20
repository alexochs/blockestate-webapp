import { rentalsContractAddress } from "@/helpers/contractAddresses";
import { abi as rentalsAbi } from "@/helpers/BlockEstateRentals.json";
import { Asset } from "@/helpers/types";
import { Box, Button, Card, CardBody, CardHeader, Center, Flex, Heading, HStack, Icon, Image, Link, Text } from "@chakra-ui/react";
import { useContractRead } from 'wagmi';
import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function AssetRentPreviewCard({ asset, filterFixed, filterMonthly }: any) {
    const _asset = asset as Asset;

    const [isFixedRentable, setFixedRentable] = useState(0);
    const readFixedRentable = useContractRead({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isRentable",
        args: [_asset.tokenId],
        onSuccess: (result: any) => {
            setFixedRentable(result);
        }
    })

    const [pricePerDay, setPricePerDay] = useState(0);
    const readPricePerDay = useContractRead({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerDay",
        args: [_asset.tokenId],
        onSuccess: (result: any) => {
            setPricePerDay(parseInt(result._hex, 16));
        }
    })

    const [isMonthlyRentable, setMonthlyRentable] = useState(0);
    const readMonthlyRentable = useContractRead({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "isMonthlyRentable",
        args: [_asset.tokenId],
        onSuccess: (result: any) => {
            setMonthlyRentable(result);
        }
    })

    const [pricePerMonth, setPricePerMonth] = useState(0);
    const readPricePerMonth = useContractRead({
        address: rentalsContractAddress,
        abi: rentalsAbi,
        functionName: "pricePerMonth",
        args: [_asset.tokenId],
        onSuccess: (result: any) => {
            setPricePerMonth(parseInt(result._hex, 16));
        }
    })

    return (isFixedRentable && !filterFixed) || (isMonthlyRentable && !filterMonthly) ? (
        <Link
            href={"/rent/" + _asset.tokenId}
            style={{ textDecoration: "none" }}
            _hover={{ transform: "scale(1.025)" }}
        >
            <Card rounded="3xl" w="25vw" _hover={{ background: "gray.100" }}>
                <CardHeader p="0">
                    <Image src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/f5fca80b-f5ec-4ff8-a773-6ea92382826e.jpeg?im_w=1200&im_format=avif" roundedTop="3xl" h="16rem" fit="cover" />
                </CardHeader>

                <CardBody minH="12rem">
                    <Heading fontSize="2xl">
                        {_asset.city + ", " + _asset.country}
                    </Heading>

                    <Center alignContent="start" justifyContent="start" justifyItems="start" justifySelf="start">
                        <Icon color="gray.600" mr=".125rem" as={FaStar} w=".8rem" h=".8rem" />
                        <Text color="gray.600" fontSize="lg">New&nbsp;</Text>
                    </Center>

                    {isFixedRentable && <Text pt="1rem" fontSize="lg" color="gray.500">{(pricePerDay / 1e6).toLocaleString()}$ per Day</Text>}
                    {isMonthlyRentable && <Text fontSize="lg" color="gray.500">{(pricePerMonth / 1e6).toLocaleString()}$ per Month</Text>}

                    <HStack pt="2rem">
                        <Button colorScheme="green" size="lg" variant="outline" rounded="full">
                            Available
                        </Button>
                    </HStack>
                </CardBody>
            </Card>
        </Link>
    ) : null;
}
