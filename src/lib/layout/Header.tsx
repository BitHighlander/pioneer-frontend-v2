import { Box, Button, Flex, Image, Badge,  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider } from "@chakra-ui/react";

import ThemeToggle from "./ThemeToggle";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ChevronDownIcon } from '@chakra-ui/icons'
// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'
import { ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
// let spec = 'https://pioneers.dev/spec/swagger.json'
let spec = 'http://127.0.0.1:9001/spec/swagger.json'

const Header = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const navigate = useNavigate();
  const handleToHome = () => navigate("/");
  const handleToDapps = () => navigate("/dapps");
  const handleToBlockchains = () => navigate("/blockchains");
  const handleToAssets = () => navigate("/assets");
  const handleToNodes = () => navigate("/nodes");
  const handleToPioneers = () => navigate("/pioneers");
  const [pioneers, setPioneers] = useState(0)
  const [assets, setAssets] = useState(0)
  const [blockchains, setBlockchains] = useState(0)
  const [nodes, setNodes] = useState(0)
  const [dapps, setDapps] = useState(0)
  const [fox, setFox] = useState(0)

  let onStart = async function(){
    try{
      let queryKey = localStorage.getItem('queryKey')
      let username= localStorage.getItem('username')
      if (!queryKey) {
        console.log("Creating new queryKey~!")
        queryKey = 'key:' + uuidv4()
        localStorage.setItem('queryKey', queryKey)
      }
      if (!username) {
        console.log("Creating new username~!")
        username = 'user:' + uuidv4()
        username = username.substring(0, 13);
        console.log("Creating new username~! username: ", username)
        localStorage.setItem('username', username)
      }

      let config = {
        queryKey,
        username,
        spec
      }
      console.log("config: ",config)

      //get config
      let client = new Client(spec,config)
      let pioneer = await client.init()

      let globals = await pioneer.Globals()
      console.log("globals: ",globals.data)
      setPioneers(globals.data.info.users)
      setAssets(globals.data.info.assets)
      setBlockchains(globals.data.info.blockchains)
      setNodes(globals.data.info.nodes)
      setDapps(globals.data.info.dapps)

      let minABI = [
        // balanceOf
        {
          "constant":true,
          "inputs":[{"name":"_owner","type":"address"}],
          "name":"balanceOf",
          "outputs":[{"name":"balance","type":"uint256"}],
          "type":"function"
        },
        // decimals
        {
          "constant":true,
          "inputs":[],
          "name":"decimals",
          "outputs":[{"name":"","type":"uint8"}],
          "type":"function"
        }
      ];
      let address = wallet?.accounts[0]?.address
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const newContract = new ethers.Contract("0xc770eefad204b5180df6a14ee197d99d808ee52d",minABI,ethersProvider);
      const decimals = await newContract.decimals();
      const balanceBN = await newContract.balanceOf(address)
      let foxBalance = parseInt(balanceBN/Math.pow(10, decimals))
      setFox(foxBalance)
    }catch(e){
      console.error(e)
    }
  }

  //onstart get data
  useEffect(() => {
    onStart()
  }, [wallet,wallet?.provider])

  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="left"
      gridGap={2}
    >
      <Box >

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Image
              src="/assets/compass.png"
              title="vite"
              height="22"
              width="22"
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleToAssets}><Badge><small>{assets}</small></Badge> Assets</MenuItem>
            <MenuItem onClick={handleToDapps}><Badge><small>{dapps}</small></Badge> Dapps</MenuItem>
            <MenuItem onClick={handleToBlockchains}><Badge><small>{blockchains}</small></Badge> Blockchains</MenuItem>
            <MenuItem onClick={handleToNodes}><Badge><small>{nodes}</small></Badge> Nodes</MenuItem>
            <MenuItem onClick={handleToPioneers}><Badge><small>{pioneers}</small></Badge> Pioneers</MenuItem>
          </MenuList>
        </Menu>
        <Badge>fox: {fox}</Badge>
        {/*<ThemeToggle />*/}
      </Box>
    </Flex>
  );
};

export default Header;
