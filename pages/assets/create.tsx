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
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
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
    const [sharesOption, setSharesOption] = useState(0);

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
                            rounded="full"
                            type={"text"}
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </Box>

                    <Box w="30%">
                        <FormLabel>Number</FormLabel>
                        <Input
                            rounded="full"
                            type={"number"}
                            value={number}
                            onChange={(e) => setNumber(e.target.valueAsNumber)}
                        />
                    </Box>

                    {category === "0" && (
                        <Box w="30%">
                            <FormLabel>Apartment Number</FormLabel>
                            <Input
                                rounded="full"
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
                            rounded="full"
                            type={"text"}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Box>

                    <Box w="30%">
                        <FormLabel pt="2rem">ZIP</FormLabel>
                        <Input
                            rounded="full"
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
                            rounded="full"
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

                <Box mb="1rem">
                    <FormLabel pt="2rem" pb="4rem">
                        Amount of Shares
                    </FormLabel>
                    <Slider
                        defaultValue={sharesOption}
                        min={0}
                        max={5}
                        step={1}
                        onChange={(val) => setSharesOption(val)}
                    >
                        <SliderMark
                            value={sharesOption}
                            textAlign="center"
                            bg="blue.500"
                            color="white"
                            mt="-16"
                            ml={-2 * sharesOption}
                            p={2}
                            rounded="full"
                        >
                            {(100 * 10 ** sharesOption).toLocaleString()}
                        </SliderMark>
                        <SliderTrack bg="blue.100">
                            <Box position="relative" right={10} />
                            <SliderFilledTrack bg="blue.400" />
                        </SliderTrack>
                        <SliderThumb boxSize={8} />
                    </Slider>
                </Box>
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
