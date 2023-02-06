import CreateAssetButton from "@/components/Buttons/CreateAssetButton";
import {
    Box,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Radio,
    RadioGroup,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CreateAssetPage() {
    const [category, setCategory] = useState("0");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState(0);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    return (
        <Box>
            <Heading>Create an Asset</Heading>

            <FormControl pt="1rem" pb="2rem">
                <FormLabel>Category</FormLabel>
                <RadioGroup value={category} onChange={setCategory}>
                    <HStack spacing="2rem">
                        <Radio value="0">Apartment</Radio>
                        <Radio value="1">House</Radio>
                    </HStack>
                </RadioGroup>

                <FormLabel pt="2rem">Street</FormLabel>
                <Input
                    type={"text"}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />

                <FormLabel pt="2rem">Number</FormLabel>
                <Input
                    type={"number"}
                    value={number}
                    onChange={(e) => setNumber(e.target.valueAsNumber)}
                />

                <FormLabel pt="2rem">City</FormLabel>
                <Input
                    type={"text"}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <FormLabel pt="2rem">Country</FormLabel>
                <Input
                    type={"text"}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </FormControl>

            <CreateAssetButton
                category={parseInt(category)}
                street={street}
                number={number}
                city={city}
                country={country}
            />
        </Box>
    );
}
