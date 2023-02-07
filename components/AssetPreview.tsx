import { Asset } from "@/helpers/types";
import { Box, Heading, Link, Text } from "@chakra-ui/react";

export default function AssetPreview({ asset }: any) {
    const _asset = asset as Asset;

    return (
        <Link
            href={"/assets/" + _asset.tokenId}
            style={{ textDecoration: "none" }}
        >
            <Box
                border="1px solid gray"
                rounded="3xl"
                p="1rem"
                textDecor="none"
            >
                <Heading fontSize="4xl">
                    {_asset.street + " " + _asset.number}
                </Heading>

                <Text fontSize="xl">{_asset.city + ", " + _asset.country}</Text>

                <Text pt="2rem" fontSize="xs" color="gray.400">
                    {"BlockEstate #" + _asset.tokenId}
                </Text>
            </Box>
        </Link>
    );
}
