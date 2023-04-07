import CreateAssetButton from "@/components/Buttons/CreateAssetButton";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Input,
    Radio,
    RadioGroup,
    Select,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import countryList from "country-list-js";
import { MdApartment, MdHouse, MdSkipNext } from "react-icons/md";

export default function CreateAssetPage() {
    const countries = countryList.names().sort();

    const [step, setStep] = useState(0);

    const [category, setCategory] = useState(0);
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState<number | null>(null);
    const [apNumber, setApNumber] = useState<number | null>(null);
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("United States");
    const [sharesOption, setSharesOption] = useState(0);

    return (
        <Box h="50vh" flexDir="column">
            <Center flexDir="column">
                {step == 0 ? <Center flexDir="column">
                    <Heading fontSize="6xl">What&apos;s the type of your asset?</Heading>
                    <HStack mt="2rem" spacing="1rem">
                        <Button
                            onClick={() => setCategory(0)}
                            colorScheme={category === 0 ? "blue" : "gray"}
                            variant={category === 0 ? "solid" : "outline"}
                            rounded="full"
                            w="16rem"
                            h="4rem"
                        >
                            <Center>
                                <Icon as={MdApartment} boxSize="2rem" mr=".5rem" />
                                <Text fontSize="2xl">Apartment</Text>
                            </Center>
                        </Button>

                        <Button
                            onClick={() => setCategory(1)}
                            colorScheme={category === 1 ? "blue" : "gray"}
                            variant={category === 1 ? "solid" : "outline"}
                            rounded="full"
                            w="16rem"
                            h="4rem"
                        >
                            <Center>
                                <Icon as={MdHouse} boxSize="2rem" mr=".5rem" />
                                <Text fontSize="2xl">House</Text>
                            </Center>
                        </Button>
                    </HStack>
                </Center> : step == 1 ? <Center flexDir="column">
                    <Heading fontSize="6xl">Where is your asset located?</Heading>

                    <Stack spacing="2rem">
                        <HStack spacing="1rem" mt="2rem">
                            <Box>
                                <Heading mb=".5rem">Street</Heading>
                                <Input
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder="Evergreen Terrace"
                                    rounded="full"
                                    w="20rem"
                                    h="3rem"
                                />
                            </Box>

                            <Box>
                                <Heading mb=".5rem">No.</Heading>
                                <Input
                                    type="number"
                                    value={number}
                                    onChange={(e) => setNumber(parseInt(e.target.value))}
                                    placeholder="742"
                                    rounded="full"
                                    w="10rem"
                                    h="3rem"
                                />
                            </Box>

                            {category === 0 && <Box>
                                <Heading mb=".5rem">Ap.</Heading>
                                <Input
                                    type="number"
                                    value={apNumber}
                                    onChange={(e) => setApNumber(parseInt(e.target.value))}
                                    placeholder="1"
                                    rounded="full"
                                    w="10rem"
                                    h="3rem"
                                />
                            </Box>}
                        </HStack>

                        <HStack spacing="1rem" mt="2rem">
                            <Box>
                                <Heading mb=".5rem">City</Heading>
                                <Input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Springfield"
                                    rounded="full"
                                    w="20rem"
                                    h="3rem"
                                />
                            </Box>

                            <Box>
                                <Heading mb=".5rem">ZIP</Heading>
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
                                    placeholder="80085"
                                    rounded="full"
                                    w="10rem"
                                    h="3rem"
                                />
                            </Box>
                        </HStack>

                        <Box mt="2rem">
                            <Heading mb=".5rem">Country</Heading>
                            <Select
                                h="3rem"
                                rounded="full"
                                onChange={(e) => {
                                    if (!countries.includes(e.target.value)) return;
                                    setCountry(e.target.value);
                                }}
                                value={country}
                            >
                                {countries.map((country: string) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </Stack>
                </Center> : step == 2 ? <Center flexDir="column">
                    <Heading fontSize="6xl">How many shares should exist?</Heading>

                    <Box mt="2rem" w="20rem">
                        <Heading mb=".5rem">Amount</Heading>
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
                </Center> : step == 3 ? <Center flexDir="column">
                    <Heading fontSize="6xl">Check and mint your asset</Heading>

                    <Stack spacing="2rem" mt="2rem">
                        <Box>
                            <Heading mb=".5rem">Type</Heading>
                            <Text>{category === 0 ? "Apartment" : "House"}</Text>
                        </Box>

                        <Box>
                            <Heading mb=".5rem">Address</Heading>
                            <Text>{`${street} ${number}`}</Text>
                            {category === 0 && <Text>{"Apartment No. " + apNumber}</Text>}
                            <Text>{`${zip} ${city}`}</Text>
                            <Text>{country}</Text>
                        </Box>

                        <Box>
                            <Heading mb=".5rem">Shares</Heading>
                            <Text>{100 * 10 ** sharesOption}</Text>
                        </Box>
                    </Stack>
                </Center> : null}


                <HStack spacing="1rem" mt="4rem">
                    {step > 0 && <Button
                        onClick={() => setStep(step - 1)}
                        colorScheme="blue"
                        rounded="full"
                        variant={"ghost"}
                        w="6rem"
                        h="3rem"
                    >
                        <Center>
                            <Text fontSize="xl">Back</Text>
                        </Center>
                    </Button>}

                    {step != 3 ?
                        <Button
                            onClick={() => setStep(step + 1)}
                            colorScheme="blue"
                            rounded="full"
                            variant="outline"
                            w="6rem"
                            h="3rem"
                            isDisabled={step == 1 && (!street || !number || (category == 0 && !apNumber) || !city || !zip || !country)}
                        >
                            <Center>
                                <Text fontSize="xl">Next</Text>
                            </Center>
                        </Button> :
                        <CreateAssetButton
                            category={category}
                            street={street}
                            number={number}
                            apNumber={apNumber}
                            city={city}
                            zip={zip}
                            country={country}
                            sharesOption={sharesOption}
                        />}
                </HStack>
            </Center>
        </Box>
    )
}
