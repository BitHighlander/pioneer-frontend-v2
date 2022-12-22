import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useEffect
} from 'react';
// import { AiFillGithub } from "react-icons/ai";
import { useConnectWallet } from "@web3-onboard/react";
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'
let spec = 'https://pioneers.dev/spec/swagger.json'

const LoginSection = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const onLogin = async function(){
    try{
      let address = wallet?.accounts[0]?.address
      console.log("address: ",address)

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

      //is address logged in?
      let user = await pioneer.GetUser({publicAddress:address})
      console.log("user: ",user.data)

      //login
      let nonce = user.data.nonce
      let message = `I am signing my one-time nonce: ${nonce}`

      console.log("wallet: ",wallet)
      // console.log("wallet: ",wallet.provider)
      // console.log("wallet: ",await wallet.provider.request('personal_sign'))
      // console.log("wallet: ",wallet.provider.request(message,address))
      // const signature = await wallet.provider.request('personal_sign',{message,address})
      // const signature = await wallet.sign(
      //     `I am signing my one-time nonce: ${nonce}`,
      //     address,
      //     '' // MetaMask will ignore the password argument here
      // );
      // console.log("signature: ",signature)

      console.log("message: ",message)
      console.log("address: ",address)

      // const ethersWallet = new ethers.Wallet(wallet.provider)
      if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
      const signer = ethersProvider.getSigner()
      let signature = await signer.signMessage(message)
      console.log("signature: ",signature)
      console.log("address: ",address)
      console.log("message: ",message)

      //signin get api key
      let loginResp = await pioneer.Login({},{publicAddress:address,signature,message})
      console.log("loginResp: ",loginResp.data)

      //store api key in localstoarage


      return true
    }catch(e){
      console.error(e)
    }
  }

  useEffect(() => {
    if(wallet?.accounts && wallet?.accounts[0]?.address){
      onLogin()
    }
  }, [wallet,wallet?.provider])

  const onConnect = async function () {
    try {
      if(!wallet)
        await connect();
      return true;
    } catch (e) {
      console.error(e);
    }
  };

  // Chakra color mode
  const titleColor = useColorModeValue("gray.300", "black.200");
  const textColor = useColorModeValue("gray.400", "white");

  return (

          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Login With Web3
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            />
            <FormControl>
              <Button
                onClick={onConnect}
                fontSize="10px"
                type="submit"
                bg="green.300"
                w="100%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "green.200",
                }}
                _active={{
                  bg: "green.400",
                }}
              >
                SIGN IN
              </Button>
            </FormControl>
          </Flex>

  );
};

export default LoginSection;
