import { Box, Button, Flex, Image } from "@chakra-ui/react";

import ThemeToggle from "./ThemeToggle";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleToHome = () => navigate("/");
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="left"
      gridGap={2}
    >
      <Box >
        <Button
          mt={4}
          type='submit'
          onClick={handleToHome}
        >
          <Image
            src="/assets/compass.png"
            title="vite"
            height="22"
            width="22"
          />Home
        </Button>
        {/*<ThemeToggle />*/}
      </Box>
    </Flex>
  );
};

export default Header;
