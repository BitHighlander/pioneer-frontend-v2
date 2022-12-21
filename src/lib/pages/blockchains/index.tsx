
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


import WhitelistBlockchains from "./components/WhitelistBlockchains";
import SubmitBlockchains from "./components/SubmitBlockchains";
import ReviewBlockchainss from "./components/ReviewBlockchains";

const Blockchains = () => {


  return (
    <div>
      <h3>Welcome Pioneers! Help new users discover and chart new Blockchains</h3>
      <Tabs>
        <TabList>
          <Tab>Blockchains Pending Review</Tab>
          <Tab>Blockchains Live on Pioneer</Tab>
          <Tab>Chart a newly discoverd Blockchain</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <WhitelistBlockchains />
          </TabPanel>
          <TabPanel>
            <ReviewBlockchainss />
          </TabPanel>
          <TabPanel>
            <SubmitBlockchains />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Blockchains;
