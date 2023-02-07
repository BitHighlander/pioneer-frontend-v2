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

const SubmitAssets = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const [usernamePioneer, setUsernamePioneer] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [image, setImage] = React.useState('')
  const [github, setGithub] = React.useState('')

  const handleInputChangeUsername = (e:any) => setUsernamePioneer(e.target.value)
  const handleInputChangeEmail = (e:any) => setEmail(e.target.value)
  const handleInputChangeImage = (e:any) => setImage(e.target.value)
  const handleInputChangeGithub = (e:any) => setGithub(e.target.value)


  // const isError = input === ''
  const isError = false

  let onSubmit = async function(){
    try{
      console.log("username: ",usernamePioneer)
      console.log("email: ",email)
      console.log("image: ",image)
      console.log("github: ",github)

      let developer:any = {}

      let queryKey = localStorage.getItem('queryKey')
      let username = localStorage.getItem('username')
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
        username,
        github,
        email,
      }
      payload = JSON.stringify(payload)

      let address = wallet?.accounts[0]?.address
      if(!address) throw Error("Onbord not setup! no address ")
      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(payload)
      developer.publicAddress = address.toLowerCase()
      developer.developer = address.toLowerCase()
      developer.username = username.toLowerCase()
      developer.github = github.toLowerCase()
      developer.email = email.toLowerCase()
      developer.image = image
      developer.signer = address.toLowerCase()
      developer.message = payload
      developer.signature = signature
      console.log("developer: ",developer)
      let txInfo = await pioneer.RegisterDeveloper({},developer)
      console.log("SUCCESS: ",txInfo.data)

    }catch(e){
      console.error(e)
    }
  }

  return (
    <div>
      <FormControl isInvalid={isError}>
        <FormLabel>Pioneer Username</FormLabel>
        <Input type='email' value={usernamePioneer} onChange={handleInputChangeUsername} />
        {!isError ? (
          <FormHelperText>
            Enter your pioneer username
          </FormHelperText>
        ) : (
          <FormErrorMessage>pioneer username is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>email</FormLabel>
        <Input type='email' value={email} onChange={handleInputChangeEmail} />
        {!isError ? (
            <FormHelperText>
              Enter your email address
            </FormHelperText>
        ) : (
            <FormErrorMessage>email address is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>Github username</FormLabel>
        <Input type='email' value={github} onChange={handleInputChangeGithub} />
        {!isError ? (
          <FormHelperText>
            Enter your github username
          </FormHelperText>
        ) : (
          <FormErrorMessage>github username is required.</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={isError}>
        <FormLabel>Profile Image URL</FormLabel>
        <Input type='email' value={image} onChange={handleInputChangeImage} />
        {!isError ? (
          <FormHelperText>
            Enter the URL of image for for your profile (must be a URL and not a encoded data:image... object)
          </FormHelperText>
        ) : (
          <FormErrorMessage>profile URL is required.</FormErrorMessage>
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

export default SubmitAssets;
