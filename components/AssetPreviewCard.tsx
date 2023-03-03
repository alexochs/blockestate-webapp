import { Asset } from "@/helpers/types";
import { Box, Card, CardBody, CardHeader, Heading, Image, Link, Text } from "@chakra-ui/react";

export default function AssetPreview({ asset }: any) {
    const _asset = asset as Asset;

    return (
        <Link
            href={"/assets/" + _asset.tokenId}
            style={{ textDecoration: "none" }}
            _hover={{ transform: "scale(1.05)" }}
        >
            <Card rounded="3xl" w="20vw">
                <CardHeader p="0">
                    <Image src="https://cdn.fertighauswelt.de/85c04f5301d5d668cbbfb45e848a68a5ab7bfb6d/villa-bauen.jpg" roundedTop="3xl" h="16rem" fit="cover" />
                </CardHeader>

                <CardBody minH="12rem">
                    <Box>
                        <Heading fontSize="4xl">
                            {_asset.street + " " + _asset.number}
                        </Heading>
                        <Text fontSize="xl" color="gray.500">{_asset.city + ", " + _asset.country}</Text>
                    </Box>
                </CardBody>
            </Card>
        </Link>
    );
}
