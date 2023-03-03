import { Box } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: any) {
    return (
        <Box color="gray.700" bg="gray.50">
            <Navbar />
            <Box minH="90vh" px="10vw" pt="15vh">
                <main>{children}</main>
            </Box>
            <Footer />
        </Box>
    );
}
