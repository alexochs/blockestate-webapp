import { Box } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Montserrat, Poppins } from "@next/font/google";
import { useAccount } from "wagmi";

const montserrat = Montserrat({ subsets: ['latin'] });
const poppins = Poppins({ weight: "400", subsets: ['latin'] });

export default function Layout({ children }: any) {
    const account = useAccount();

    return (
        <Box color="gray.700" bg="gray.50">
            <Navbar account={account} />
            <Box minH="90vh" px="10vw" pt="15vh" pb="5vh">
                <main>{children}</main>
            </Box>
            <Footer />
        </Box>
    );
}
