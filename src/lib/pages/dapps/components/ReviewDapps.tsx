import { Grid, Image, Button } from "@chakra-ui/react";
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
//let spec = 'http://127.0.0.1:9001/spec/swagger.json'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useEffect } from "react";

const columnHelper = createColumnHelper<any>()



const ReviewDapps = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  // const alert = useAlert()
  const [votedUpNames, setVotedUpNames] = React.useState(() => [])
  const [votedDownNames, setVotedDownNames] = React.useState(() => [])
  const [data, setData] = React.useState(() => [{
    "name": "etherscan",
    "app": "https://etherscan.io/",
    "tags": [
      "ethereum",
      "ethereum",
      "d2ae9c3c2782806fd6db704bf40ef0238af9470d7964ae566114a033f4a9a110"
    ],
    "image": "https://explorer-api.walletconnect.com/v3/logo/md/de60f6e0-effe-4b8c-1f3e-e12278839300?projectId=2f05ae7f1116030fde2d36508f472bfb",
    "developer": "0x3f2329c9adfbccd9a84f52c906e936a42da18cb8",
    "facts": [
      {
        "signer": "0x3f2329c9adfbccd9a84f52c906e936a42da18cb8",
        "payload": "{\"name\":\"Etherscan\",\"url\":\"https://etherscan.io/\"}",
        "signature": "0x64c2da509ce6cada0432e5dcdc961adf44012f5a4fba84277bc77f60b97d5d2476ecc0c4268d42dc8e40e952e5a653ae9c9bd0d820d19e25ad388bcd6373361e1b"
      }
    ],
    "description": "app name is Etherscan",
    "homepage": "https://etherscan.io/",
    "id": "8fQirfJGia8T4frRCp7aKd",
    "isSpotlight": false,
    "whitelist": false,
    "created": 1671477059170,
    "trust": 0,
    "transparency": 0,
    "innovation": 0,
    "popularity": 0
  }])
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
    // columnHelper.accessor('name', {
    //   id: 'approve',
    //   cell: info => <Button onClick={() => whitelistEntry(info.getValue())}>approve</Button>,
    //   header: () => <span>approve</span>,
    //   footer: info => info.column.id,
    // }),
  ]

  let editEntry = async function(name:string){
    try{
      //open modal
      console.log("edit name: ",name)
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
      let apps = await pioneer.SearchDappsPageniate({limit:1000,skip:0})
      console.log("apps: ",apps.data.length)
      console.log("apps: ",apps.data[0])

      //setData
      setData(apps.data)

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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
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
        <Button onClick={submitVotes}>Sign and Submit Votes</Button>
      </div>
    </div>
  );
};

export default ReviewDapps;
