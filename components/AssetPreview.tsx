import { Asset } from "@/helpers/types";
import { Box, Heading, Link, Text } from "@chakra-ui/react";

export default function AssetPreview({ asset }: any) {
    const _asset = asset as Asset;

    return (
        <Link href={"/assets/" + _asset.tokenId}>
            <Box border="1px solid gray" rounded="3xl" p="1rem">
                <Heading fontSize="2xl">{_asset.country}</Heading>
                <Text fontSize="lg">{_asset.city}</Text>
                <Text fontSize="sm">{_asset.street + " " + _asset.number}</Text>

                <Text pt=".5rem" fontSize="xs" color="gray.400">
                    {"BlockEstate #" + _asset.tokenId}
                </Text>
            </Box>
        </Link>
    );
}
