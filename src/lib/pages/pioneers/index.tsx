
import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


import WhitelistPioneers from "./components/WhitelistPioneers";
import SubmitPioneers from "./components/SubmitPioneers";
import ReviewPioneers from "./components/ReviewPioneers";

const Pioneers = () => {


  return (
    <div>
      <h3>Welcome Pioneers! View the top Pioneers in the space!</h3>
      <Tabs>
        <TabList>
          {/*<Tab>Pioneers Pending Review</Tab>*/}
          <Tab>Pioneer Rankings</Tab>
          {/*<Tab>Register as new Pioneer</Tab>*/}
        </TabList>

        <TabPanels>
          {/*<TabPanel>*/}
          {/*  <WhitelistPioneers />*/}
          {/*</TabPanel>*/}
          <TabPanel>
            <ReviewPioneers />
          </TabPanel>
          {/*<TabPanel>*/}
          {/*  <SubmitPioneers />*/}
          {/*</TabPanel>*/}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Pioneers;
