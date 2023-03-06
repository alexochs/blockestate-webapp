import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import AssetInvestListingsTab from "./AssetInvestListingsTab";
import AssetInvestShareholdersTab from "./AssetInvestShareholdersTab";

export default function AssetInvestTabs({ tokenId, sharesBalance, listings, shareholderInfos, sharesTotalSupply }: any) {
    return (
        <Tabs pt="2rem" colorScheme="blue">
            <TabList>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Listings</Tab>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Analytics</Tab>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Activity</Tab>
                <Tab roundedTop="2xl" fontWeight="bold" fontSize="lg">Shareholders</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Box pt="1rem">
                        <AssetInvestListingsTab sharesBalance={sharesBalance} listings={listings} tokenId={tokenId} />
                    </Box>
                </TabPanel>
                <TabPanel>
                    <p>two!</p>
                </TabPanel>
                <TabPanel>
                    <p>three!</p>
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