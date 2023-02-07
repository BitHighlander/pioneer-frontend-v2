import { Grid, Image, Button, Table } from "@chakra-ui/react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useConnectWallet } from "@web3-onboard/react";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
// import { useAlert } from 'react-alert'

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

const columnHelper = createColumnHelper<any>()



const ReviewBlockchains = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  // const alert = useAlert()
  const [data, setData] = React.useState(() => [{
    "_id": {
      "$oid": "63a0d3201057635a9f8dc60f"
    },
    "name": "Ethereum Mainnet",
    "type": "EVM",
    "image": "https://pioneers.dev/coins/ethereum-mainnet.png",
    "tags": [
      "KeepKeySupport",
      "DappSupport",
      "WalletConnectSupport",
      "EVM",
      "ethereum",
      "Ether",
      "ETH",
      1,
      null
    ],
    "blockchain": "ethereum",
    "symbol": "ETH",
    "service": null,
    "chainId": 1,
    "network": [
      "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com"
    ],
    "facts": [
      {
        "signer": "0x3f2329c9adfbccd9a84f52c906e936a42da18cb8",
        "payload": "{\"blockchain\":\"Ethereum Mainnet\",\"symbol\":\"ETH\",\"chainId\":1}",
        "signature": "0x29581d5c7e2add0c1d1eea4040f827002aac9f1fc12afe53dc0ce87585c4b5737ff73df0b6788f92085bfc2a3e81e6462a5f59205a4c9e24ccab5eb1a15a27eb1b"
      }
    ],
    "explorer": "https://ethereum.org",
    "description": "more info here: https://ethereum.org This is a EVM network with chainId: 1 Follows EIP:155",
    "faucets": []
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
    columnHelper.accessor('github', {
      cell: info => <a href={'https://github.com/'+info.getValue()}>{info.getValue()}</a> ,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('publicAddress', {
      cell: info =><div><small>{info.getValue()}</small></div> ,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('email', {
      cell: info => <div>{info.getValue()}</div> ,
      footer: info => info.column.id,
    }),
  ]

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
      let devs = await pioneer.ListDevelopers({limit:1000,skip:0})
      console.log("devs: ",devs.data.length)
      console.log("devs: ",devs.data[0])
      setData(devs.data)



    }catch(e){
      console.error(e)
    }
  }

  //onstart get data
  useEffect(() => {
    onStart()
  }, [wallet,wallet?.provider])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="p-2">
        <Button onClick={onStart}>Refresh</Button>
        <Table>
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
        </Table>
        <div className="h-4" />
      </div>
    </div>
  );
};

export default ReviewBlockchains;
