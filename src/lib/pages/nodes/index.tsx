
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


import WhitelistNodes from "./components/WhitelistNodes";
import SubmitNodes from "./components/SubmitNodes";
import ReviewNodes from "./components/ReviewNodes";

const Nodes = () => {


  return (
    <div>
      <h3>Welcome Pioneers! Help new users discover and chart new Nodes</h3>
      <Tabs>
        <TabList>
          <Tab>Nodes Pending Review</Tab>
          <Tab>Nodes Live on Pioneer</Tab>
          <Tab>Chart a newly discoverd Nodes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <WhitelistNodes />
          </TabPanel>
          <TabPanel>
            <ReviewNodes />
          </TabPanel>
          <TabPanel>
            <SubmitNodes />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Nodes;
