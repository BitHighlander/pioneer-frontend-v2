
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


// import WhitelistAssets from "./components/WhitelistAssets";
import SubmitAssets from "./components/SubmitAssets";
import ReviewAssets from "./components/ReviewAssets";

const Assets = () => {


  return (
    <div>
      <h3>Welcome Pioneers! Help new users discover and chart new Assets</h3>
      <Tabs>
        <TabList>
          <Tab>Assets Live on Pioneer</Tab>
          <Tab>Chart a newly discoverd Assets</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ReviewAssets />
          </TabPanel>
          <TabPanel>
            <SubmitAssets />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Assets;
