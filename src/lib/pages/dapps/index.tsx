
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


import WhitelistDapps from "./components/WhitelistDapps";
import SubmitDapps from "./components/SubmitDapps";
import ReviewDapps from "./components/ReviewDapps";

const Dapps = () => {


  return (
    <div>
      <h3>Welcome Pioneers! Help new users discover and chart new Dapps</h3>
      <Tabs>
        <TabList>
          <Tab>Apps Pending Review</Tab>
          <Tab>Apps live for voting</Tab>
          <Tab>Chart a newly discovered Dapp</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <WhitelistDapps />
          </TabPanel>
          <TabPanel>
            <ReviewDapps />
          </TabPanel>
          <TabPanel>
            <SubmitDapps />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Dapps;
