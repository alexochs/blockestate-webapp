import { Flex, Image } from "@chakra-ui/react";

export default function AssetHeaderImages() {
    return (
        <Flex>
            <Image
                src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/0cf46569-a5cd-4aa0-bbbd-156162c84e7e.jpeg"
                fit="cover"
                h="60vh"
                w="50%"
                roundedLeft="3xl"
                pr=".25rem"
            />

            <Flex flexDir="column" px=".25rem" w="25%">
                <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/e5596519-efcf-4a65-bd12-3191ebd33ee6.jpeg" fit="cover" h="30vh" pb=".5rem" />
                <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/a4a94c93-df0c-45db-90fe-2ee46654df8d.jpeg" fit="cover" h="30vh" />
            </Flex>

            <Flex flexDir="column" pl=".25rem" w="25%">
                <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/6c5c0a5e-ea60-417d-8c1c-cdcdaa0d0c21.jpeg?im_w=720" fit="cover" h="30vh" pb=".5rem" roundedRight={"3xl"} />
                <Image src="https://a0.muscache.com/im/pictures/miso/Hosting-52250528/original/44777246-61ff-408c-be6d-f1c9262e340e.jpeg?im_w=720" fit="cover" h="30vh" roundedRight={"3xl"} />
            </Flex>
        </Flex>
    );
}