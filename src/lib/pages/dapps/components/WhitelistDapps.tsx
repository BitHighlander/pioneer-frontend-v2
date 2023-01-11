/* eslint-disable no-await-in-loop */
import {
  Grid,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import Client from "@pioneer-platform/pioneer-client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
// import { useAlert } from 'react-alert'

// @ts-ignore
// let spec = 'http://127.0.0.1:9001/spec/swagger.json'
const spec = "https://pioneers.dev/spec/swagger.json";

const columnHelper = createColumnHelper<any>();

const WhitelistDapps = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  let [value, setValue] = React.useState("");
  // const alert = useAlert()
  const [data, setData] = React.useState(() => [
    {
      name: "etherscan",
      app: "https://etherscan.io/",
      tags: [
        "ethereum",
        "ethereum",
        "d2ae9c3c2782806fd6db704bf40ef0238af9470d7964ae566114a033f4a9a110",
      ],
      image:
        "https://explorer-api.walletconnect.com/v3/logo/md/de60f6e0-effe-4b8c-1f3e-e12278839300?projectId=2f05ae7f1116030fde2d36508f472bfb",
      developer: "0x3f2329c9adfbccd9a84f52c906e936a42da18cb8",
      facts: [
        {
          signer: "0x3f2329c9adfbccd9a84f52c906e936a42da18cb8",
          payload: '{"name":"Etherscan","url":"https://etherscan.io/"}',
          signature:
            "0x64c2da509ce6cada0432e5dcdc961adf44012f5a4fba84277bc77f60b97d5d2476ecc0c4268d42dc8e40e952e5a653ae9c9bd0d820d19e25ad388bcd6373361e1b",
        },
      ],
      description: "app name is Etherscan",
      homepage: "https://etherscan.io/",
      id: "8fQirfJGia8T4frRCp7aKd",
      isSpotlight: false,
      whitelist: false,
      created: 1671477059170,
      trust: 0,
      transparency: 0,
      innovation: 0,
      popularity: 0,
    },
  ]);

  const columns = [
    columnHelper.accessor("image", {
      cell: (info) => (
        <Image
          src={info.getValue()}
          alt="keepkey api"
          objectFit="cover"
          height="60px"
          width="60px"
          objectPosition="center"
        />
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("app", {
      cell: (info) => <a href={info.getValue()}>{info.getValue()}</a>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      id: "edit",
      cell: (info) => (
        <Button onClick={() => editEntry(info.getValue())}>Edit</Button>
      ),
      header: () => <span>edit</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      id: "approve",
      cell: (info) => (
        <Button onClick={() => whitelistEntry(info.getValue())}>approve</Button>
      ),
      header: () => <span>approve</span>,
      footer: (info) => info.column.id,
    }),
  ];

  let editEntry = async function (name: string) {
    try {
      // open modal
      console.log("edit name: ", name);
      onOpen();
      const entry = data.filter(function (e) {
        return e.name === name;
      })[0];
      console.log("entry: ", entry);
      const prettyJson = JSON.stringify(entry, null, 2);
      setValue(prettyJson);
    } catch (e) {
      console.error(e);
    }
  };

  let whitelistEntry = async function (name: string) {
    try {
      let queryKey = localStorage.getItem("queryKey");
      let username = localStorage.getItem("username");
      if (!queryKey) {
        console.log("Creating new queryKey~!");
        queryKey = `key:${uuidv4()}`;
        localStorage.setItem("queryKey", queryKey);
      }
      if (!username) {
        console.log("Creating new username~!");
        username = `user:${uuidv4()}`;
        username = username.substring(0, 13);
        console.log("Creating new username~! username: ", username);
        localStorage.setItem("username", username);
      }

      const config = {
        queryKey,
        username,
        spec,
      };
      console.log("config: ", config);

      // get config
      const client = new Client(spec, config);
      const pioneer = await client.init();

      // open modal
      console.log("whitelistEntry name: ", name);

      const entry = data.filter(function (e) {
        return e.name === name;
      })[0];
      console.log("entry: ", entry);

      // let payload: any = {
      //   name,
      //   app: entry.app,
      // };
      // payload = JSON.stringify(payload);
      let payload = `{"type": "dapp", "name": "${name}", "url": "${entry.app}"}`

      if (!wallet || !wallet.provider) throw Error("Onbord not setup!");
      const ethersProvider = new ethers.providers.Web3Provider(
        wallet.provider,
        "any"
      );
      const signer = ethersProvider.getSigner();
      const signature = await signer.signMessage(payload);
      const address = wallet?.accounts[0]?.address;
      const whitelist: any = {};
      whitelist.signer = address;
      whitelist.payload = payload;
      whitelist.signature = signature;
      if (!address) throw Error("address required!");

      console.log("whitelist: ", whitelist);
      const resultWhitelist = await pioneer.WhitelistApp("", whitelist);
      console.log("resultWhitelist: ", resultWhitelist.data);
      // alert.show(resultWhitelist.data)
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitEdit = async function () {
    try {
      let queryKey = localStorage.getItem("queryKey");
      let username = localStorage.getItem("username");
      if (!queryKey) {
        console.log("Creating new queryKey~!");
        queryKey = `key:${uuidv4()}`;
        localStorage.setItem("queryKey", queryKey);
      }
      if (!username) {
        console.log("Creating new username~!");
        username = `user:${uuidv4()}`;
        username = username.substring(0, 13);
        console.log("Creating new username~! username: ", username);
        localStorage.setItem("username", username);
      }

      const config = {
        queryKey,
        username,
        spec,
      };
      console.log("config: ", config);

      // get config
      const client = new Client(spec, config);
      const pioneer = await client.init();

      try {
        const diffJson = (
          obj1: { [x: string]: any },
          obj2: { [x: string]: any }
        ) => {
          const diffArray = [];
          for (const key in obj1) {
            if (obj2[key] !== undefined && typeof obj2[key] !== "object") {
              if (obj1[key] !== obj2[key]) {
                diffArray.push({
                  key,
                  value: obj2[key],
                });
              }
            }
          }
          return diffArray;
        };
        value = JSON.parse(value);
        // entry DB
        const entry = data.filter(function (e) {
          // @ts-ignore
          return e.name === value.name;
        })[0];
        console.log("entry: ", entry);
        // @ts-ignore
        const diffs = diffJson(entry, value);

        for (let i = 0; i < diffs.length; i++) {
          const diff: any = diffs[i];
          // @ts-ignore
          diff.name = value.name;
          const payload = JSON.stringify(diff);

          if (!wallet || !wallet.provider) throw Error("Onbord not setup!");
          const ethersProvider = new ethers.providers.Web3Provider(
            wallet.provider,
            "any"
          );
          const signer = ethersProvider.getSigner();
          const signature = await signer.signMessage(payload);
          const address = wallet?.accounts[0]?.address;
          const update: any = {};
          update.signer = address;
          update.payload = payload;
          update.signature = signature;
          if (!address) throw Error("address required!");
          // submit as admin
          console.log("update: ", update);
          const resultWhitelist = await pioneer.UpdateApp("", update);
          console.log("resultWhitelist: ", resultWhitelist);
        }
      } catch (e) {
        // alert invalid JSON!
        console.error("e: ", e);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onStart = async function () {
    try {
      if (!wallet) await connect();
      let queryKey = localStorage.getItem("queryKey");
      let username = localStorage.getItem("username");
      if (!queryKey) {
        console.log("Creating new queryKey~!");
        queryKey = `key:${uuidv4()}`;
        localStorage.setItem("queryKey", queryKey);
      }
      if (!username) {
        console.log("Creating new username~!");
        username = `user:${uuidv4()}`;
        username = username.substring(0, 13);
        console.log("Creating new username~! username: ", username);
        localStorage.setItem("username", username);
      }

      const config = {
        queryKey,
        username,
        spec,
      };
      console.log("config: ", config);

      // get config
      const client = new Client(spec, config);
      const pioneer = await client.init();

      // get all unapproved dapps
      const apps = await pioneer.ListAppsPending({ limit: 1000, skip: 0 });
      console.log("apps: ", apps.data.length);
      console.log("apps: ", apps.data[0]);

      // setData
      setData(apps.data);
    } catch (e) {
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const handleInputChange = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="100px">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              height="600px"
              value={value}
              onChange={handleInputChange}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onSubmitEdit} variant="green">
              Submit changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="p-2">
        <Button onClick={onStart}>Refresh</Button>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
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

export default WhitelistDapps;
