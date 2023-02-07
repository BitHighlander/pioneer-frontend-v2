import {
  Grid,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Textarea,
  ModalFooter,
  useDisclosure,
  Box,
  Text
} from "@chakra-ui/react";
import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import { useConnectWallet } from "@web3-onboard/react";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
// import { useAlert } from 'react-alert'

// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'
// let spec = 'https://pioneers.dev/spec/swagger.json'
let spec = 'http://127.0.0.1:9001/spec/swagger.json'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useEffect } from "react";
import {Select as SelectImported} from "chakra-react-select";

const columnHelper = createColumnHelper<any>()



const ReviewBlockchains = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const isError = false
  const [query, setQuery] = useState('bitcoin...');
  const [timeOut, setTimeOut] = useState(null);
  let [value, setValue] = React.useState("");
  //
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

  // const alert = useAlert()
  const [data, setData] = React.useState(() => [{
    "name": "bitcoin cash",
    "type": "slip44",
    "caip": "bip122:000000000000000000651ef99cb9fcbe/slip44:145",
    "tags": [
      "KeepKeySupport",
      "BCH",
      "Bitcoin Cash"
    ],
    "description":"digital payments",
    "blockchain": "bitcoin cash",
    "symbol": "BCH",
    "decimals": 8,
    "image": "https://assets.coincap.io/assets/icons/256/bch.png",
    "facts": [
      {
        "signer": "0x2356a15042f98f0a53784f42237bd4b2873aadcf",
        "payload": "{\"blockchain\":\"Bitcoin Cash\",\"chainReference\":\"000000000000000000651ef99cb9fcbe\",\"chainNamespace\":\"slip44\",\"assetReference\":\"145\"}",
        "signature": "0x0eea2620cd0cb51064c1e051b964e11e21b6bcee276b208d52a6f5e5e67747270fc3882dd5f9e9d370cd49cee60ed6f2c6ae6a4c13ec66896615a002f57f11d51c"
      }
    ],
    "explorer": "https://blockchair.com",
    "explorerAddressLink": "https://blockchair.com/bitcoin-cash/address/",
    "explorerTxLink": "https://blockchair.com/bitcoin-cash/transaction/"
  }])

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
    columnHelper.accessor('blockchain', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('name', {
      cell: info => <a href={info.getValue()}>{info.getValue()}</a> ,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('caip', {
      cell: info => <a href={info.getValue()}>{info.getValue()}</a> ,
      footer: info => info.column.id,
    }),
    columnHelper.accessor("name", {
      id: "edit",
      cell: (info) => (
          <Button onClick={() => editEntry(info.getValue())}>Edit</Button>
      ),
      header: () => <span>edit</span>,
      footer: (info) => info.column.id,
    }),
    // columnHelper.accessor('name', {
    //   id: 'edit',
    //   cell: info => <Button onClick={() => editEntry(info.getValue())}>Edit</Button>,
    //   header: () => <span>edit</span>,
    //   footer: info => info.column.id,
    // }),
    // columnHelper.accessor('name', {
    //   id: 'approve',
    //   cell: info => <Button onClick={() => whitelistEntry(info.getValue())}>approve</Button>,
    //   header: () => <span>approve</span>,
    //   footer: info => info.column.id,
    // }),
  ]

  let whitelistEntry = async function(name:string){
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

      //open modal
      console.log("whitelistEntry name: ",name)

      // let entry = data.filter(function (e) { return e.name === name; })[0];
      // console.log("entry: ",entry)

      // let payload:any = {
      //   name,
      //   app:entry.app
      // }
      // payload = JSON.stringify(payload)
      //
      // if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      // const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      // const signer = ethersProvider.getSigner()
      // let signature = await signer.signMessage(payload)
      // let address = wallet?.accounts[0]?.address
      // let whitelist:any = {}
      // whitelist.signer = address
      // whitelist.payload = payload
      // whitelist.signature = signature
      // if(!address) throw Error("address required!")
      //
      // console.log("whitelist: ",whitelist)
      // let resultWhitelist = await pioneer.ChartBlockchain("",whitelist)
      // console.log("resultWhitelist: ",resultWhitelist.data)
      // alert.show(resultWhitelist.data)
    }catch(e){
      console.error(e)
    }
  }

  let onStart = async function(){
    try{
      if(!wallet)
        await connect();
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
      let assets = await pioneer.SearchAssetsList({limit:1000,skip:0})
      console.log("assets: ",assets.data.length)
      console.log("assets: ",assets.data[0])

      //setData
      setData(assets.data)

    }catch(e){
      console.error(e)
    }
  }

  //onstart get data
  useEffect(() => {
    onStart()
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  let editEntry = async function(name:string){
    try{
      //open modal
      console.log("edit name: ",name)
      onOpen()
      let entry = data.filter(function (e) { return e.name === name; })[0];
      console.log("entry: ",entry)

      setName(entry.name)
      setImage(entry.image)
      setCAIP(entry.caip)
      setSymbol(entry.symbol)
      // @ts-ignore
      setDecimals(entry.decimals)
      setBlockchain(entry.blockchain)
      // @ts-ignore
      setFacts(entry.facts)
      // @ts-ignore
      setTags(entry.tags)
      setExplorer(entry.explorer)
      setExplorerAddressLink(entry.explorerAddressLink)
      setExplorerTxLink(entry.explorerTxLink)

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
    }catch(e){
      console.error(e)
    }
  }

  const search = async (query:string) => {
    // console.log("event: ",event.target.value)
    console.log("query: ",query)
    // let searchNew = event.target.value
    // setSearch(searchNew)

    let config = { queryKey: 'key:public', spec }
    let Api = new Client(spec, config)
    let api = await Api.init()

    let KeepKeyPage1 = await api.SearchAssetsByName(query)
    console.log("KeepKeyPage1: ",KeepKeyPage1.data)
    setData(KeepKeyPage1.data)
  };

  const onClear = async () => {
    setQuery("")
  };

  const handleKeyPress = (event:any) => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setQuery(event.target.value);
    // @ts-ignore
    setTimeOut(setTimeout(() => {
      search(query);
    }, 1000));
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
            {/*<FormControl isInvalid={isError}>*/}
            {/*  <FormLabel>asset</FormLabel>*/}
            {/*  <Input type='text' value={asset} onChange={handleInputChangeApp} />*/}
            {/*  {!isError ? (*/}
            {/*      <FormHelperText>*/}
            {/*        Enter the app of the app.*/}
            {/*      </FormHelperText>*/}
            {/*  ) : (*/}
            {/*      <FormErrorMessage>app is required.</FormErrorMessage>*/}
            {/*  )}*/}
            {/*</FormControl>*/}

            <FormControl isInvalid={isError}>
              <FormLabel>Image</FormLabel>
              <Input type='text' value={image} onChange={handleInputChangeImage} />
              {!isError ? (
                  <FormHelperText>
                    Enter the image of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>image is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isError}>
              <FormLabel>CAIP</FormLabel>
              <Input type='text' value={caip} onChange={handleInputChangeCAIP} />
              {!isError ? (
                  <FormHelperText>
                    Enter the CAIP of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>CAIP is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isError}>
              <FormLabel>Symbol</FormLabel>
              <Input type='text' value={symbol} onChange={handleInputChangeSymbol} />
              {!isError ? (
                  <FormHelperText>
                    Enter the symbol of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>symbol is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isError}>
              <FormLabel>Decimals</FormLabel>
              <Input type='text' value={decimals} onChange={handleInputChangeDecimals} />
              {!isError ? (
                  <FormHelperText>
                    Enter the decimals of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>decimals is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isError}>
              <FormLabel>Blockchain</FormLabel>
              <Input type='text' value={blockchain} onChange={handleInputChangeBlockchain} />
              {!isError ? (
                  <FormHelperText>
                    Enter the blockchain of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>blockchain is required.</FormErrorMessage>
              )}
            </FormControl>

            {/*<FormControl isInvalid={isError}>*/}
            {/*  <FormLabel>Facts</FormLabel>*/}
            {/*  <Input type='text' value={facts} onChange={handleInputChangeFacts} />*/}
            {/*  {!isError ? (*/}
            {/*      <FormHelperText>*/}
            {/*        Enter the facts of the app.*/}
            {/*      </FormHelperText>*/}
            {/*  ) : (*/}
            {/*      <FormErrorMessage>facts is required.</FormErrorMessage>*/}
            {/*  )}*/}
            {/*</FormControl>*/}

            <FormControl isInvalid={isError}>
              <FormLabel>Tags</FormLabel>
              <Input type='text' value={tags} onChange={handleInputChangeTags} />
              {!isError ? (
                  <FormHelperText>
                    Enter the tags of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>tags is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isError}>
              <FormLabel>Explorer</FormLabel>
              <Input type='text' value={explorer} onChange={handleInputChangeExplorer} />
              {!isError ? (
                  <FormHelperText>
                    Enter the explorer of the app.
                  </FormHelperText>
              ) : (
                  <FormErrorMessage>explorer is required.</FormErrorMessage>
              )}
            </FormControl>

            {/*<FormControl isInvalid={isError}>*/}
            {/*  <FormLabel>Explorer Address Link</FormLabel>*/}
            {/*  <Input type='text' value={explorerAddressLink} onChange={handleInputChangeExplorerAddressLink} />*/}
            {/*  {!isError ? (*/}
            {/*      <FormHelperText>*/}
            {/*        Enter the explorer address link of the app.*/}
            {/*      </FormHelperText>*/}
            {/*  ) : (*/}
            {/*      <FormErrorMessage>explorer address link is required.</FormErrorMessage>*/}
            {/*  )}*/}
            {/*</FormControl>*/}

            {/*<FormControl isInvalid={isError}>*/}
            {/*  <FormLabel>Explorer Tx Link</FormLabel>*/}
            {/*  <Input type='text' value={explorerTxLink} onChange={handleInputChangeExplorerTxLink} />*/}
            {/*  {!isError ? (*/}
            {/*      <FormHelperText>*/}
            {/*        Enter the explorer tx link of the app.*/}
            {/*      </FormHelperText>*/}
            {/*  ) : (*/}
            {/*      <FormErrorMessage>explorer tx link is required.</FormErrorMessage>*/}
            {/*  )}*/}
            {/*</FormControl>*/}

            {/*<FormControl isInvalid={isError}>*/}
            {/*  <FormLabel>Protocols Supported</FormLabel>*/}
            {/*  <Input type='text' value={protocolsSupported} onChange={handleInputChangeProtocolsSupported} />*/}
            {/*  {!isError ? (*/}
            {/*      <FormHelperText>*/}
            {/*        Enter the protocols supported of the app.*/}
            {/*      </FormHelperText>*/}
            {/*  ) : (*/}
            {/*      <FormErrorMessage>protocols supported is required.</FormErrorMessage>*/}
            {/*  )}*/}
            {/*</FormControl>*/}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onSubmitEdit} variant='green'>Submit changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <Text>Search:</Text>
        <input
            onFocus={onClear}
            value={query}
            onChange={handleKeyPress}
            type='search'
            style={{border: '2px solid black', padding: '15px'}}
        />
      </Box>
      <Button onClick={onStart}>Refresh</Button>
      <div className="p-2">
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
      </div>
    </div>
  );
};

export default ReviewBlockchains;
