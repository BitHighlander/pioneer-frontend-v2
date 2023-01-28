
import React, {useEffect} from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useConnectWallet } from "@web3-onboard/react";

import WhitelistDapps from "./components/WhitelistDapps";
import SubmitDapps from "./components/SubmitDapps";
import VoteDapps from "./components/VoteDapps";
// import ReviewDapps from "./components/ReviewDapps";

const Dapps = () => {


  return (
    <div>
      <h3>Welcome Pioneers! Help new users discover and chart new Dapps</h3>
      <Tabs>
        <TabList>
          <Tab>Apps Pending Review</Tab>
          <Tab>Apps live for voting</Tab>
          <Tab>Chart a newly discovered Dapp</Tab>
          {/*<Tab>Review Live Dapps</Tab>*/}
        </TabList>

        <TabPanels>
          <TabPanel>
            <WhitelistDapps />
          </TabPanel>
          <TabPanel>
            <VoteDapps />
          </TabPanel>
          <TabPanel>
            <SubmitDapps />
          </TabPanel>
          {/*<TabPanel>*/}
          {/*  <ReviewDapps />*/}
          {/*</TabPanel>*/}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Dapps;
