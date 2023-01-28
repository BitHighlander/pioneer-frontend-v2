import {
  Grid,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody, Textarea, ModalFooter, useDisclosure, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage
} from "@chakra-ui/react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useConnectWallet } from "@web3-onboard/react";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
// import { useAlert } from 'react-alert'
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/react'
// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'
let spec = 'https://pioneers.dev/spec/swagger.json'
// let spec = 'http://127.0.0.1:9001/spec/swagger.json'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useEffect } from "react";
import {Select as SelectImported} from "chakra-react-select";

const columnHelper = createColumnHelper<any>()

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
  },
  {
    value:'defi-governence',
    label:'defi-governence'
  },
]


const ReviewDapps = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const alert = useAlert()

  const [votedUpNames, setVotedUpNames] = React.useState(() => [])
  const [votedDownNames, setVotedDownNames] = React.useState(() => [])
  const [data, setData] = React.useState(() => [{
    "_id": {
      "$oid": "63bbacaf3ac9260013faf19c"
    },
    "name": "shapeshift",
    "app": "https://web-theta-one.vercel.app/",
    "tags": [
      "bitcoin",
      "litecoin",
      "ethereum",
      "avalancec",
      "dash",
      "bitcoincash",
      "dogecoin",
      "cosmos",
      "osmosis",
      "REST"
    ],
    "description":"",
    "image": "https://assets.coincap.io/assets/icons/fox@2x.png",
    "developer": "0x2356a15042f98f0a53784f42237bd4b2873aadcf",
    "protocols": [
      "REST"
    ],
    "blockchains": [
      "bitcoin",
      "litecoin",
      "ethereum",
      "avalancec",
      "",
      "bitcoincash",
      "dogecoin",
      "cosmos",
      "osmosis"
    ],
    "facts": [
      {
        "signer": "0x2356a15042f98f0a53784f42237bd4b2873aadcf",
        "payload": "{\"type\": \"dapp\", \"name\": ShapeShift, \"url\": https://web-theta-one.vercel.app/}",
        "signature": "0x46ec20fd6d7eba1292fe789585aa78881774502416893eac6c0a435e6cb7cd5c1742ed076d0df5fc6db0455828cee1198967c58dae1f2f63d80d1612d5a0f6691c"
      }
    ],
    "minVersion": [
      "2.0.0"
    ],
    "features":[],
    "homepage": "https://web-theta-one.vercel.app/",
    "isSpotlight": false,
    "whitelist": true,
    "id": "gCAbv2axCFEm3ZYtPWpbU7",
    "created": 1673243823262,
    "trust": 0,
    "transparency": 0,
    "innovation": 0,
    "popularity": 0,
    "score": 12087.558269976245
  }])

  const [name, setName] = React.useState('')
  const [app, setApp] = React.useState('')
  const [image, setImage] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [minVersion, setMinVersion] = React.useState([])
  const [blockchains, setBlockchains] = React.useState([])
  const [protocolsSupported, setProtocolsSupported] = React.useState([])
  const [featuresSupported, setFeaturesSupported] = React.useState([])
  const [entry, setEntry] = React.useState(null)
  const [isRest, setIsRest] = React.useState(false)
  const [blockchainsSupported, setBlockchainsSupported] = React.useState([])
  const handleInputChangeName = (e:any) => setName(e.target.value)
  const handleInputChangeApp = (e:any) => setApp(e.target.value)
  const handleInputChangeImage = (e:any) => setImage(e.target.value)
  const handleInputChangeMinVersion = (e:any) => setMinVersion(e.target.value)
  const handleInputChangeDescription = (e:any) => setDescription(e.target.value)
  const isError = false
  const toast = useToast()

  let isUpActive = function(name:string){
    console.log("isUpActive: ",name)
    // @ts-ignore
    if(votedUpNames.indexOf(name) >= 0){
      console.log("isUpActive: TRUE",name)
      return 'green'
    } else {
      console.log("isUpActive: FALSE",name)
      return 'gray'
    }
  }


  const columns = [
    columnHelper.accessor('image', {
      cell: info => <Image
        src={info.getValue()}
        alt='keepkey api'
        objectFit="cover"
        height="60px"
        width="60px"
        objectPosition="center"
      >
      </Image>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('app', {
      cell: info => <a href={info.getValue()}>{info.getValue()}</a> ,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('score', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
      id: 'upvote',
      cell: info => <Button
          onClick={() => upVote(info.getValue())}
      ><ArrowUpIcon w={8} h={8} color="green.500" /></Button>,
      header: () => <span>upvote</span>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
      id: 'downvote',
      cell: info => <Button onClick={() => downVote(info.getValue())}><ArrowDownIcon w={8} h={8} color="red.500" /></Button>,
      header: () => <span>downvote</span>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
      id: 'edit',
      cell: info => <Button onClick={() => editEntry(info.getValue())}>Edit</Button>,
      header: () => <span>edit</span>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('revoke', {
      id: 'revoke',
      cell: info => <Button colorScheme='red' onClick={() => onRevokeEntry(info.getValue())}>revoke</Button>,
      header: () => <span>edit</span>,
      footer: info => info.column.id,
    }),
    // columnHelper.accessor('name', {
    //   id: 'approve',
    //   cell: info => <Button onClick={() => whitelistEntry(info.getValue())}>approve</Button>,
    //   header: () => <span>approve</span>,
    //   footer: info => info.column.id,
    // }),
  ]

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

      //get all unapproved dapps
      let apps = await pioneer.SearchDappsPageniate({limit:1000,skip:0})
      console.log("apps: ",apps.data.length)
      console.log("apps: ",apps.data[0])
      const sortArrayByScore = (arr: any[]) => {
        return arr.sort((a, b) => {
          if (a.score === undefined) a.score = 0;
          if (b.score === undefined) b.score = 0;
          return b.score - a.score;
        });
      }
      apps.data = sortArrayByScore(apps.data)
      console.log("apps: ",apps.data)

      //setData
      setData(apps.data)

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
      console.log("blockchainsFormated: ",blockchainsFormated.length)
      setBlockchains(blockchainsFormated)

    }catch(e){
      console.error(e)
    }
  }

  //onstart get data
  useEffect(() => {
    onStart()
  }, [])

  let upVote = async function(name:string){
    try{
      //open modal
      console.log("upVote: ",name)
      // @ts-ignore
      // votedUpNames.push(name)
      // setVotedUpNames(votedUpNames)
      // console.log("votedUpNames: ",votedUpNames)

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

      //update entry
      let entry = {
        "name":name,
        "vote":"up"
      }
      //toString
      let payload = JSON.stringify(entry)

      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      let address = wallet?.accounts[0]?.address
      let update:any = {}
      update.signer = address
      update.payload = payload
      update.signature = signature
      if(!address) throw Error("address required!")
      //submit as admin
      console.log("update: ",update)
      let resultWhitelist = await pioneer.VoteOnApp("",update)
      console.log("resultWhitelist: ",resultWhitelist)

      toast({
        title: 'User Voted!.',
        description: "You UP voted for "+name+ " result: "+resultWhitelist.data?.message,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setTimeout(onStart,2000)
    }catch(e){
      console.error(e)
    }
  }

  let downVote = async function(name:string){
    try{
      //open modal
      console.log("downVote: ",name)
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
      //update entry
      let entry = {
        "name":name,
        "vote":"down"
      }
      //toString
      let payload = JSON.stringify(entry)

      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      let address = wallet?.accounts[0]?.address
      let update:any = {}
      update.signer = address
      update.payload = payload
      update.signature = signature
      if(!address) throw Error("address required!")
      //submit as admin
      console.log("update: ",update)
      let resultWhitelist = await pioneer.VoteOnApp("",update)
      console.log("resultWhitelist: ",resultWhitelist)

      toast({
        title: 'User Voted!.',
        description: "You DOWN voted for "+name+ " result: "+resultWhitelist.data?.message,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

      setTimeout(onStart,2000)

    }catch(e){
      console.error(e)
    }
  }

  let submitVotes = async function(){
    try{
      //open modal
      console.log("submitVotes: ")
    }catch(e){
      console.error(e)
    }
  }

  let editEntry = async function(name:string){
    try{
      //open modal
      console.log("edit name: ",name)
      onOpen()
      let entry = data.filter(function (e) { return e.name === name; })[0];
      console.log("entry: ",entry)
      // @ts-ignore
      setEntry(entry)
      setName(entry.name)
      setApp(entry.app)
      setImage(entry.image)
      setDescription(entry.description)
      // @ts-ignore
      setMinVersion(entry.minVersion)
      // @ts-ignore
      setBlockchains(entry.blockchains)
      // @ts-ignore
      setProtocolsSupported(entry.protocols)
      setFeaturesSupported(entry.features)
      // setIsRest(entry.isRest)
      // @ts-ignore
      setBlockchainsSupported(entry.blockchains)

    }catch(e){
      console.error(e)
    }
  }

  let onSubmitEdit = async function(){
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

      try{

        //check name
        // @ts-ignore
        if(entry?.name !== name){
            console.log("Name Has changed!")
            let diff = {
              name,
              key:"name",
              value:name
            }
            let payload = JSON.stringify(diff)
            if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
            const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
            const signer = ethersProvider.getSigner()
            let signature = await signer.signMessage(payload)
            let address = wallet?.accounts[0]?.address
            let update:any = {}
            update.name = name
            update.signer = address
            update.payload = payload
            update.signature = signature
            if(!address) throw Error("address required!")
            //submit as admin
            console.log("update: ",update)
            let resultWhitelist = await pioneer.UpdateApp("",update)
            console.log("resultWhitelist: ",resultWhitelist)
        }
        //check url
        // @ts-ignore
        if(entry?.app !== app){
          console.log("app Has changed!")
          let diff = {
            name,
            key:"app",
            value:app
          }
          let payload = JSON.stringify(diff)
          if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
          const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
          const signer = ethersProvider.getSigner()
          let signature = await signer.signMessage(payload)
          let address = wallet?.accounts[0]?.address
          let update:any = {}
          update.signer = address
          update.payload = payload
          update.signature = signature
          if(!address) throw Error("address required!")
          //submit as admin
          console.log("update: ",update)
          let resultWhitelist = await pioneer.UpdateApp("",update)
          console.log("resultWhitelist: ",resultWhitelist)
        }

        //check image
        // @ts-ignore
        if(entry?.image !== image){
          console.log("app Has changed!")
          let diff = {
            name,
            key:"image",
            value:image
          }
          let payload = JSON.stringify(diff)
          if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
          const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
          const signer = ethersProvider.getSigner()
          let signature = await signer.signMessage(payload)
          let address = wallet?.accounts[0]?.address
          let update:any = {}
          update.name = name
          update.signer = address
          update.payload = payload
          update.signature = signature
          if(!address) throw Error("address required!")
          //submit as admin
          console.log("update: ",update)
          let resultWhitelist = await pioneer.UpdateApp("",update)
          console.log("resultWhitelist: ",resultWhitelist)
        }

        //check description
        // @ts-ignore
        if(entry?.description !== description){
          console.log("description Has changed!")
          let diff = {
            name,
            key:"description",
            value:description
          }
          let payload = JSON.stringify(diff)
          if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
          const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
          const signer = ethersProvider.getSigner()
          let signature = await signer.signMessage(payload)
          let address = wallet?.accounts[0]?.address
          let update:any = {}
          update.name = name
          update.signer = address
          update.payload = payload
          update.signature = signature
          if(!address) throw Error("address required!")
          //submit as admin
          console.log("update: ",update)
          let resultWhitelist = await pioneer.UpdateApp("",update)
          console.log("resultWhitelist: ",resultWhitelist)
        }

        //check blockchains
        // @ts-ignore
        if(entry?.blockchains !== blockchainsSupported){
          console.log("description Has changed!")
          let diff = {
            name,
            type:"array",
            action:"push", //push, replace, remove
            key:"blockchains",
            "value":blockchainsSupported
          }
          let payload = JSON.stringify(diff)
          if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
          const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
          const signer = ethersProvider.getSigner()
          let signature = await signer.signMessage(payload)
          let address = wallet?.accounts[0]?.address
          let update:any = {}
          update.name = name
          update.signer = address
          update.payload = payload
          update.signature = signature
          if(!address) throw Error("address required!")
          //submit as admin
          console.log("update: ",update)
          let resultWhitelist = await pioneer.UpdateApp("",update)
          console.log("resultWhitelist: ",resultWhitelist)
        }

        //check protocols


        //check features


        //entry DB
        // let entry = data.filter(function (e) { // @ts-ignore
        //   return e.name === value.name; })[0];
        // console.log("entry: ",entry)
        // // @ts-ignore
        // let diffs = diffJson(entry,value)
        //
        // for(let i = 0; i < diffs.length; i++){
        //   let diff:any = diffs[i]
        //   // @ts-ignore
        //   diff.name = value.name
        //   let payload = JSON.stringify(diff)
        //
        //   if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
        //   const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
        //   const signer = ethersProvider.getSigner()
        //   let signature = await signer.signMessage(payload)
        //   let address = wallet?.accounts[0]?.address
        //   let update:any = {}
        //   update.signer = address
        //   update.payload = payload
        //   update.signature = signature
        //   if(!address) throw Error("address required!")
        //   //submit as admin
        //   console.log("update: ",update)
        //   let resultWhitelist = await pioneer.UpdateApp("",update)
        //   console.log("resultWhitelist: ",resultWhitelist)
        // }

      }catch(e){
        //alert invalid JSON!
        console.error("e: ",e)
      }
    }catch(e){
      console.error(e)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // let handleInputChange = (e: { target: { value: any; }; }) => {
  //   let inputValue = e.target.value
  //   setValue(inputValue)
  // }

  let onSelectedBlockchains = async function(inputs: any){
    try{
      console.log("input: onSelectedBlockchains: ",inputs)
      let blockchains:any = []
      for(let i = 0; i < inputs.length; i++){
        let input = inputs[i]
        blockchains.push(input.name)
      }
      setBlockchainsSupported(blockchains)
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


  let onRevokeEntry = async function(entry:any){
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

      let payload: any = {
        action:"revoke",
        name,
        app: entry.app,
      };
      payload = JSON.stringify(payload);

      //revoking
      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      let address = wallet?.accounts[0]?.address
      let update:any = {}
      update.signer = address
      update.payload = payload
      update.signature = signature
      if(!address) throw Error("address required!")
      //submit as admin
      console.log("update: ",update)
      let resultWhitelist = await pioneer.RevokeApp("",update)
      console.log("resultWhitelist: ",resultWhitelist)


    }catch(e){
      console.error(e)
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}
             size='100px' >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
              <FormLabel>Dapp Desription</FormLabel>
              <Textarea placeholder="This Dapp is great because it does..... " value={description} onChange={handleInputChangeDescription} />
              {!isError ? (
                  <FormHelperText>
                    Describe the Dapp in a short paragraph.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>description is required.</FormErrorMessage>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onSubmitEdit} variant='green'>Submit changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="p-2">
        <Button onClick={onStart}>Refresh</Button>
        <table>
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
        <div className="h-4" />
        {/*<Button onClick={submitVotes}>Sign and Submit Votes</Button>*/}
      </div>
    </div>
  );
};

export default ReviewDapps;
