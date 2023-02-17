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
    Select,
} from "@chakra-ui/react";
import { useState } from "react";
import countryList from "country-list-js";

export default function CreateAssetPage() {
    const countries = countryList.names().sort();

    const [category, setCategory] = useState("0");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState(0);
    const [apNumber, setApNumber] = useState(0);
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("");

    return (
        <Box>
            <Heading>Create an Asset</Heading>

            <FormControl pt="1rem" pb="4rem">
                <FormLabel>Category</FormLabel>
                <RadioGroup value={category} onChange={setCategory}>
                    <HStack spacing="2rem">
                        <Radio value="0">Apartment</Radio>
                        <Radio value="1">House</Radio>
                    </HStack>
                </RadioGroup>

                <HStack pt="2rem">
                    <Box w="30%">
                        <FormLabel>Street</FormLabel>
                        <Input
                            type={"text"}
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Box>

                    <Box w="30%">
                        <FormLabel>Number</FormLabel>
                        <Input
                            type={"number"}
                            value={number}
                            onChange={(e) => setNumber(e.target.valueAsNumber)}
                        />
                    </Box>

                    {category === "0" && (
                        <Box w="30%">
                            <FormLabel>Apartment Number</FormLabel>
                            <Input
                                isDisabled={category === "1"}
                                type={"number"}
                                value={apNumber}
                                onChange={(e) =>
                                    setApNumber(e.target.valueAsNumber)
                                }
                            />
                        </Box>
                    )}
                </HStack>

                <HStack>
                    <Box w="30%">
                        <FormLabel pt="2rem">City</FormLabel>
                        <Input
                            type={"text"}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Box>

                    <Box w="30%">
                        <FormLabel pt="2rem">ZIP</FormLabel>
                        <Input
                            type={"text"}
                            value={zip}
                            onChange={(e) => {
                                if (
                                    e.target.value.match(/^\d+$/) ||
                                    e.target.value === ""
                                )
                                    setZip(e.target.value);
                            }}
                        />
                    </Box>

                    <Box w="30%">
                        <FormLabel pt="2rem">Country</FormLabel>
                        <Select
                            onChange={(e) => {
                                if (!countries.includes(e.target.value)) return;
                                setCountry(e.target.value);
                            }}
                        >
                            {countries.map((country: string) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </Select>
                    </Box>
                </HStack>
            </FormControl>

            <CreateAssetButton
                category={parseInt(category)}
                street={street}
                number={number}
                apNumber={apNumber}
                city={city}
                zip={zip}
                country={country}
            />
        </Box>
    );
}
