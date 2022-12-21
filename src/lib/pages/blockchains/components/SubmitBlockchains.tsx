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
let spec = 'https://pioneers.dev/spec/swagger.json'
// let spec = 'http://127.0.0.1:9001/spec/swagger.json'

const SubmitBlockchains = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const [name, setName] = React.useState('')
  const [app, setApp] = React.useState('')
  const [image, setImage] = React.useState('')

  const handleInputChangeName = (e:any) => setName(e.target.value)
  const handleInputChangeApp = (e:any) => setApp(e.target.value)
  const handleInputChangeImage = (e:any) => setImage(e.target.value)


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
      dapp.image = image
      dapp.tags = ['ethereum']

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
        app
      }
      payload = JSON.stringify(payload)

      let address = wallet?.accounts[0]?.address
      if(!address) throw Error("Onbord not setup! no address ")
      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      dapp.protocol  = ['wallet-connect-v1']
      dapp.version = "wc-1"
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
            Enter the URL of the dapp
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
            Enter the URL of image for the Dapp
          </FormHelperText>
        ) : (
          <FormErrorMessage>image URL is required.</FormErrorMessage>
        )}
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

export default SubmitBlockchains;
