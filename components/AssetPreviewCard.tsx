import { Asset } from "@/helpers/types";
import { Box, Card, CardBody, CardHeader, Heading, Image, Link, Spacer, Text } from "@chakra-ui/react";

export default function AssetPreview({ asset }: any) {
    const _asset = asset as Asset;

    return (
        <Link
            href={"/assets/" + _asset.tokenId}
            style={{ textDecoration: "none" }}
            _hover={{ transform: "scale(1.025)" }}
        >
            <Card rounded="3xl" w={["100%", "25vw"]} _hover={{ background: "gray.100" }}>
                <CardHeader p="0">
                    <Image src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/f5fca80b-f5ec-4ff8-a773-6ea92382826e.jpeg?im_w=1200&im_format=avif" roundedTop="3xl" h="16rem" fit="cover" />
                </CardHeader>

                <CardBody>
                    <Heading fontSize={["3xl", "4xl"]}>
                        {_asset.street + " " + _asset.number}
                    </Heading>

                    <Spacer />

                    <Text fontSize="xl" color="gray.500">{_asset.city + ", " + _asset.country}</Text>
                </CardBody>
            </Card>
        </Link >
    );
}
