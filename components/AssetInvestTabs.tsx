import { MarketEvent } from "@/helpers/types";
import { supabase } from "@/lib/supabaseClient";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AssetInvestActivityTab from "./AssetInvestActivityTab";
import AssetInvestAnalyticsTab from "./AssetInvestAnalyticsTab";
import AssetInvestListingsTab from "./AssetInvestListingsTab";
import AssetInvestShareholdersTab from "./AssetInvestShareholdersTab";

export default function AssetInvestTabs({ tokenId, sharesBalance, listingPools, shareholderInfos, sharesTotalSupply, floorPrice, pricePerDay, isRentable }: any) {
    const [events, setEvents] = useState<MarketEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('market')
                .select('*')
                //.order('timestamp', { ascending: false })
                //.limit(25)
                .eq("tokenId", tokenId);

            console.log(data);
            console.log(error);
            setEvents(data as MarketEvent[]);
        }

        fetchEvents();
    }, []);

    return (
        <Tabs pt="2rem" colorScheme="blue">
            <TabList overflowX="scroll" w={["100vw", "auto"]} ml={["-5vw", "0"]}>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Listings</Tab>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Analytics</Tab>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Activity</Tab>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Shareholders</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Box pt="1rem">
                        <AssetInvestListingsTab sharesBalance={sharesBalance} listingPools={listingPools} tokenId={tokenId} />
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box pt="1rem">
                        <AssetInvestAnalyticsTab events={events} floorPrice={floorPrice} pricePerDay={pricePerDay} sharesTotalSupply={sharesTotalSupply} isRentable={isRentable} />
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box pt="1rem">
                        <AssetInvestActivityTab events={events} />
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box pt="1rem">
                        <AssetInvestShareholdersTab shareholderInfos={shareholderInfos} sharesTotalSupply={sharesTotalSupply} />
                    </Box>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}