import { AssetCategory } from "@/helpers/types";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import AssetHeaderImages from "./AssetHeaderImages";

export default function AssetHeader({ asset }: any) {
    return (
        <Box>
            <AssetHeaderImages />

            <Box pt="1rem">
                <Heading fontSize={["4xl", "8xl"]} overflowWrap="break-word">
                    {asset?.street + " " + asset?.number}
                </Heading>

                <Text fontSize={["2xl", "5xl"]} color="gray.600">
                    {asset?.city + ", " + asset?.country}
                </Text>

                {asset?.category == AssetCategory.APARTMENT && (
                    <Text fontSize="2xl" color="gray.500">Apartment {asset?.apNumber}</Text>
                )}
            </Box>
        </Box >
    );
}