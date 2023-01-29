import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button
} from '@chakra-ui/react'
import React from 'react'
import { useConnectWallet } from "@web3-onboard/react";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
// import { useAlert } from 'react-alert'

// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'
import {Select as SelectImported} from "chakra-react-select";
let spec = 'https://pioneers.dev/spec/swagger.json'
// let spec = 'http://127.0.0.1:9001/spec/swagger.json'

let protocols = [
  {
    value:'slip44',
    label:'slip44'
  },
  {
    value:'erc20',
    label:'erc20'
  },
  {
    value:'ibc',
    label:'ibc'
  }
]

/*
{
  "name": "dai stablecoin on osmosis",
  "type": "ibc",
  "caip": "cosmos:osmosis-1/ibc:0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7",
  "tags": [],
  "blockchain": "dai stablecoin on osmosis",
  "symbol": "DAI",
  "decimals": 18,
  "image": "https://rawcdn.githack.com/cosmos/chain-registry/3daa874bec573a4628abf84a7bd6f062ca67ee31/axelar/images/dai.png",
  "facts": [
    {
      "signer": "0x2356a15042f98f0a53784f42237bd4b2873aadcf",
      "payload": "{\"blockchain\":\"Dai Stablecoin on Osmosis\",\"chainReference\":\"osmosis-1\",\"chainNamespace\":\"ibc\",\"assetReference\":\"0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7\"}",
      "signature": "0x041bdab169b9812c99416ce772e225466e2cf96f0372bc60d9e2ea92c025799d280341c3b45a51a2e59402fece45a0edff79f5b2fcde0cd5cf271431997a5b3c1b"
    }
  ],
  "explorer": "https://www.mintscan.io/osmosis",
  "explorerAddressLink": "https://www.mintscan.io/osmosis/account/",
  "explorerTxLink": "https://www.mintscan.io/osmosis/txs/"
}
 */

const SubmitAssets = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const [name, setName] = React.useState('')
  const [type, setApp] = React.useState('')
  const [image, setImage] = React.useState('')
  const [caip, setCAIP] = React.useState('')
  const [symbol, setSymbol] = React.useState('')
  const [decimals, setDecimals] = React.useState('')
  const [blockchain, setBlockchain] = React.useState('')
  const [facts, setFacts] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [explorer, setExplorer] = React.useState('')
  const [explorerAddressLink, setExplorerAddressLink] = React.useState('')
  const [explorerTxLink, setExplorerTxLink] = React.useState('')
  const [protocolsSupported, setProtocolsSupported] = React.useState([])
  const handleInputChangeName = (e:any) => setName(e.target.value)
  const handleInputChangeApp = (e:any) => setApp(e.target.value)
  const handleInputChangeImage = (e:any) => setImage(e.target.value)
  const handleInputChangeCAIP = (e:any) => setCAIP(e.target.value)
  const handleInputChangeSymbol = (e:any) => setSymbol(e.target.value)
  const handleInputChangeDecimals = (e:any) => setDecimals(e.target.value)
  const handleInputChangeBlockchain = (e:any) => setBlockchain(e.target.value)
  const handleInputChangeFacts = (e:any) => setFacts(e.target.value)
  const handleInputChangeTags = (e:any) => setTags(e.target.value)
  const handleInputChangeExplorer = (e:any) => setExplorer(e.target.value)
  //handleInputChangeExplorerAddressLink
  // const handleInputChangeExplorerAddressLink = (e:any) => setExplorer(e.target.value)
  //handleInputChangeExplorerTxLink


  // const isError = input === ''
  const isError = false

  let onSubmit = async function(){
    try{
      console.log("name: ",name)
      console.log("image: ",image)

      let asset:any = {}
      asset.name = name
      asset.type = type
      asset.caip = caip
      asset.tags = []
      asset.blockchain = blockchain
      asset.symbol = symbol
      asset.decimals = decimals
      asset.image = image
      asset.facts = facts
      asset.explorer = explorer
      asset.explorerAddressLink = explorerAddressLink
      asset.explorerTxLink = explorerTxLink

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
        type,
        caip,
        tags,
        blockchain,
        symbol,
        decimals,
        image,
        facts,
        explorer,
        explorerAddressLink,
        explorerTxLink
      }
      payload = JSON.stringify(payload)

      let address = wallet?.accounts[0]?.address
      if(!address) throw Error("Onbord not setup! no address ")
      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      asset.protocol  = ['wallet-connect-v1']
      asset.version = "wc-1"
      asset.developer = address.toLowerCase()
      asset.signer = address.toLowerCase()
      asset.payload = payload
      asset.signature = signature

      let txInfo = await pioneer.ChartAsset({},asset)
      console.log("SUCCESS: ",txInfo.data)

    }catch(e){
      console.error(e)
    }
  }

  let onSelectedProtocols = async function(input: any){
    try{
      console.log("input: onSelectedProtocols: ",input)
      setProtocolsSupported(input)
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
        <FormLabel>Protocols Supported</FormLabel>
        <SelectImported
            isMulti
            name="type"
            options={protocols}
            placeholder="ibc... bip44...erc20..."
            closeMenuOnSelect={true}
            // components={{ Option: IconOption }}
            onChange={onSelectedProtocols}
        ></SelectImported>
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>caip</FormLabel>
        <Input type='email' value={caip} onChange={handleInputChangeImage} />
        {!isError ? (
          <FormHelperText>
            Enter the CAIP
          </FormHelperText>
        ) : (
          <FormErrorMessage>image URL is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>symbol</FormLabel>
        <Input type='email' value={symbol} onChange={handleInputChangeCAIP} />
        {!isError ? (
            <FormHelperText>
              Enter the symbol
            </FormHelperText>
        ) : (
            <FormErrorMessage>CAIP is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>decimals</FormLabel>
        <Input type='email' value={decimals} onChange={handleInputChangeSymbol} />
        {!isError ? (
            <FormHelperText>
              Enter the decimals
            </FormHelperText>
        ) : (
            <FormErrorMessage>symbol is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>blockchain</FormLabel>
        <Input type='email' value={blockchain} onChange={handleInputChangeDecimals} />
        {!isError ? (
            <FormHelperText>
              Enter the blockchain
            </FormHelperText>
        ) : (
            <FormErrorMessage>decimals is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>facts</FormLabel>
        <Input type='email' value={facts} onChange={handleInputChangeFacts} />
        {!isError ? (
            <FormHelperText>
              Enter the facts
            </FormHelperText>
        ) : (
            <FormErrorMessage>facts are required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>tags</FormLabel>
        <Input type='email' value={tags} onChange={handleInputChangeTags} />
        {!isError ? (
            <FormHelperText>
              Enter the tags
            </FormHelperText>
        ) : (
            <FormErrorMessage>tags are required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>explorer</FormLabel>
        <Input type='email' value={explorer} onChange={handleInputChangeExplorer} />
        {!isError ? (
            <FormHelperText>
              Enter the explorer
            </FormHelperText>
        ) : (
            <FormErrorMessage>explorer is required.</FormErrorMessage>
        )}
      </FormControl>
      {/*<FormControl isInvalid={isError}>*/}
      {/*  <FormLabel>explorer address link</FormLabel>*/}
      {/*  <Input type='email' value={explorerAddressLink} onChange={handleInputChangeExplorerAddressLink} />*/}
      {/*  {!isError ? (*/}
      {/*      <FormHelperText>*/}
      {/*        Enter the explorer address link*/}
      {/*      </FormHelperText>*/}
      {/*  ) : (*/}
      {/*      <FormErrorMessage>explorer address link is required.</FormErrorMessage>*/}
      {/*  )}*/}
      {/*</FormControl>*/}
      {/*<FormControl isInvalid={isError}>*/}
      {/*  <FormLabel>explorer tx link</FormLabel>*/}
      {/*  <Input type='email' value={explorerTxLink} onChange={handleInputChangeExplorerTxLink} />*/}
      {/*  {!isError ? (*/}
      {/*      <FormHelperText>*/}
      {/*        Enter the explorer tx link*/}
      {/*      </FormHelperText>*/}
      {/*  ) : (*/}
      {/*      <FormErrorMessage>explorer tx link is required.</FormErrorMessage>*/}
      {/*  )}*/}
      {/*</FormControl>*/}
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

export default SubmitAssets;
