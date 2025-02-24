import { Flex, Image, useMediaQuery } from "@chakra-ui/react";

export default function AssetHeaderImages() {
    const isMobile = useMediaQuery("(max-width: 768px)")[0];

    return !isMobile ? (
        <Flex>
            <Image
                src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/f5fca80b-f5ec-4ff8-a773-6ea92382826e.jpeg?im_w=1200&im_format=avif"
                fit="cover"
                h="60vh"
                w="50%"
                roundedLeft="3xl"
                pr=".25rem"
            />

            <Flex flexDir="column" px=".25rem" w="25%">
                <Image src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/0edd2289-acbf-4891-81a4-153042bd74bf.jpeg?im_w=1200&im_format=avif" fit="cover" h="30vh" pb=".5rem" />
                <Image src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/12b890a8-8b5e-41d6-8e52-e7e83c627c19.jpeg?im_w=720&im_format=avif" fit="cover" h="30vh" />
            </Flex>

            <Flex flexDir="column" pl=".25rem" w="25%">
                <Image src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/3fe982eb-562a-4dce-b176-25d57f54b728.jpeg?im_w=720&im_format=avif" fit="cover" h="30vh" pb=".5rem" roundedRight={"3xl"} />
                <Image src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/99df409a-2ede-4ae1-a7ac-2747b4ac976a.jpeg?im_w=1200&im_format=avif" fit="cover" h="30vh" roundedRight={"3xl"} />
            </Flex>
        </Flex>
    ) : (
        <Image
            src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-814167510478568514/original/f5fca80b-f5ec-4ff8-a773-6ea92382826e.jpeg?im_w=1200&im_format=avif"
            fit="cover"
            h="56vw"
            w="100vw"
            rounded="3xl"
            pr=".25rem"
        />
    );

}