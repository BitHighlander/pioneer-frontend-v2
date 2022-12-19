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
// import { AiFillGithub } from "react-icons/ai";
import { useConnectWallet } from "@web3-onboard/react";

const LoginSection = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const onConnect = async function () {
    try {
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
