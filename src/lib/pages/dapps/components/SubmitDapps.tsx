import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Stack,
  CardBody,
  Card,
  Select,
  CardFooter,
  Heading,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react'
import React from 'react'
import {
  useEffect,
  useState,
} from 'react';
import { useConnectWallet } from "@web3-onboard/react";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
import { Select as SelectImported, components } from "chakra-react-select";
// import { useAlert } from 'react-alert'

// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'
let spec = 'https://pioneers.dev/spec/swagger.json'
//let spec = 'http://127.0.0.1:9001/spec/swagger.json'

let protocols = [
  {
    value:'wallet-connect',
    label:'Wallet Connect'
  },
  {
    value:'wallet-connect-v2',
    label:'Wallet Connect-v2'
  },
  {
    value:'REST',
    label:'REST'
  }
]

let features = [
  {
    value:'basic-transfers',
    label:'basic-transfers'
  },
  {
    value:'defi-earn',
    label:'defi-earn'
  },
  {
    value:'defi-swap',
    label:'defi-swap'
  }
]

const SubmitDapps = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const [name, setName] = React.useState('')
  const [app, setApp] = React.useState('')
  const [image, setImage] = React.useState('')
  const [minVersion, setMinVersion] = React.useState('')
  const [blockchains, setBlockchains] = React.useState([])
  const [protocolsSupported, setProtocolsSupported] = React.useState([])
  const [featuresSupported, setFeaturesSupported] = React.useState([])
  const [isRest, setIsRest] = React.useState(false)
  const [blockchainsSupported, setBlockchainsSupported] = React.useState([])
  const handleInputChangeName = (e:any) => setName(e.target.value)
  const handleInputChangeApp = (e:any) => setApp(e.target.value)
  const handleInputChangeImage = (e:any) => setImage(e.target.value)
  const handleInputChangeMinVersion = (e:any) => setMinVersion(e.target.value)


  // const isError = input === ''
  const isError = false

  let onSubmit = async function(){
    try{
      console.log("name: ",name)
      console.log("app: ",app)
      console.log("image: ",image)

      let dapp:any = {}
      dapp.name = name
      dapp.app = app
      dapp.homepage = app
      dapp.tags = [...blockchainsSupported,...protocols]
      dapp.image = image
      dapp.minVersion = minVersion
      dapp.protocols = protocolsSupported
      dapp.blockchains = blockchainsSupported
      dapp.features = featuresSupported

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

      let payload:any = {
        name,
        app,
        homepage:app
      }
      payload = JSON.stringify(payload)

      let address = wallet?.accounts[0]?.address
      if(!address) throw Error("Onbord not setup! no address ")
      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      dapp.developer = address.toLowerCase()
      dapp.signer = address.toLowerCase()
      dapp.payload = payload
      dapp.signature = signature

      let txInfo = await pioneer.ChartDapp({},dapp)
      console.log("SUCCESS: ",txInfo.data)

    }catch(e){
      console.error(e)
    }
  }

  //onStart
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

      let blockchains = await pioneer.SearchBlockchainsPaginate({limit:1000,skip:0})
      blockchains = blockchains.data
      console.log("blockchains: ",blockchains.length)
      let blockchainsFormated:any = []
      for(let i = 0; i < blockchains.length; i++){
        let blockchain = blockchains[i]
        blockchain.value = blockchain.name
        blockchain.label = blockchain.name
        blockchainsFormated.push(blockchain)
      }
      //console.log("assetsFormated: ",assetsFormated.length)
      setBlockchains(blockchainsFormated)

      //get tokens for chain
      // let blockchains = await pioneer.SearchByBlockchainName()
      // blockchains = blockchains.data
      // //console.log("assets: ",assets.length)
      // let blockchainsFormated:any = []
      // for(let i = 0; i < blockchains.length; i++){
      //   let blockchain = blockchains[i]
      //   blockchain.value = blockchain.name
      //   blockchain.label = blockchain.name
      //   blockchainsFormated.push(blockchain)
      // }
      // //console.log("assetsFormated: ",assetsFormated.length)
      // setBlockchains(blockchainsFormated)
    }catch(e){
      console.error(e)
    }
  }

  // onStart()
  useEffect(() => {
    onStart()
  }, []) //once on startup

  const IconOption = (props: any) => {
    return(
        // @ts-ignore
        <Option {...props}>
          <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
          >
            <Stack>
              <Image
                  width={20}
                  height={20}
                  objectFit='cover'
                  src={props.data.image}
              />
            </Stack>
            <Stack>
              <CardBody>
                <Grid >
                  <Heading size='md'>{props.data.name}</Heading>
                  <Text>symbol: {props.data.symbol}</Text>
                  <Text>link: <a href={props.data.explorer} target="_blank" ><Text color="blue">View Explorer</Text></a></Text>
                </Grid>
              </CardBody>
            </Stack>
          </Card>
        </Option>
    )};

  let onSelectedBlockchains = async function(input: any){
    try{
      console.log("input: onSelectedBlockchains: ",input)
      setBlockchainsSupported(input)
    }catch(e){
      console.error(e)
    }
  };

  let onSelectedProtocols = async function(input: any){
    try{
      console.log("input: onSelectedProtocols: ",input)
      setProtocolsSupported(input)
      let isRestFound
      for(let i = 0; i < input.length; i++){
        let protocol = input[i]
        if(protocol.value === 'REST'){
          setIsRest(true)
          isRestFound = true
        }
      }
      if(!isRestFound){
        setIsRest(false)
      }
    }catch(e){
      console.error(e)
    }
  };

  let onSelectedFeatures = async function(input: any){
    try{
      console.log("input: onSelectedFeatures: ",input)
      setFeaturesSupported(input)
    }catch(e){
      console.error(e)
    }
  };

  return (
    <div>
      <FormControl isInvalid={isError}>
        <FormLabel>Name</FormLabel>
        <Input type='email' value={name} onChange={handleInputChangeName} />
        {!isError ? (
          <FormHelperText>
            Enter the name of the app.
          </FormHelperText>
        ) : (
          <FormErrorMessage>name is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>App URL</FormLabel>
        <Input type='email' value={app} onChange={handleInputChangeApp} />
        {!isError ? (
          <FormHelperText>
            Enter the URL of the dapp application
          </FormHelperText>
        ) : (
          <FormErrorMessage>URL is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>Image URL</FormLabel>
        <Input type='email' value={image} onChange={handleInputChangeImage} />
        {!isError ? (
          <FormHelperText>
            Enter the URL of image for the Dapp. this MUST be a valid URL, and not a encoding!
          </FormHelperText>
        ) : (
          <FormErrorMessage>image URL is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        Blockchains Supported By Dapp
        <SelectImported
          isMulti
          name="assets"
          options={blockchains}
          placeholder="ethereum... bitcoin... avalanche...."
          closeMenuOnSelect={true}
          // components={{ Option: IconOption }}
          onChange={onSelectedBlockchains}
        ></SelectImported>
        <FormHelperText>
          Enter all the blockchains that the dapp supports.
        </FormHelperText>
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>Protocols Supported</FormLabel>
        <SelectImported
            isMulti
            name="assets"
            options={protocols}
            placeholder="wallet-connect... wallet-connect-v2... REST...."
            closeMenuOnSelect={true}
            // components={{ Option: IconOption }}
            onChange={onSelectedProtocols}
        ></SelectImported>
      </FormControl>
      {isRest ? <div>
        <FormControl isInvalid={isError}>
          <FormLabel>Minimum Version Requirements</FormLabel>
          <Input type='email' value={minVersion} onChange={handleInputChangeMinVersion} />
          {!isError ? (
              <FormHelperText>
                (REST ONLY) Enter the VERSION of keepkey-desktop required for the dapp to work.
              </FormHelperText>
          ) : (
              <FormErrorMessage>min version is required.</FormErrorMessage>
          )}
        </FormControl>
      </div>:<div></div>}
      <FormControl isInvalid={isError}>
        <FormLabel>Features Supported</FormLabel>
        <SelectImported
            isMulti
            name="features"
            options={features}
            placeholder="basic-transfers... defi-earn...."
            closeMenuOnSelect={true}
            // components={{ Option: IconOption }}
            onChange={onSelectedFeatures}
        ></SelectImported>
      </FormControl>
      <Button
        mt={4}
        colorScheme='teal'
        //isLoading={props.isSubmitting}
        type='submit'
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default SubmitDapps;
