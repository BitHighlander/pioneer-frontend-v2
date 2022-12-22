import { Grid, Heading, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SomeText = () => {
  const navigate = useNavigate();
  const handleToDapps = () => navigate("/dapps");
  const handleToBlockchains = () => navigate("/blockchains");
  const handleToAssets = () => navigate("/assets");
  const handleToNodes = () => navigate("/nodes");
  const handleToPioneers = () => navigate("/pioneers");

  return (
    <Grid textAlign="center" gap={2}>
        <Heading fontSize="2xl" fontWeight="extrabold">
          Pioneers.dev
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Exploring the World of Crypto....
        </Text>
      <Link onClick={handleToDapps}>
        <Text color="gray.500" fontSize="sm">
          Explore Dapps.
        </Text>
      </Link>
      <Link onClick={handleToBlockchains}>
        <Text color="gray.500" fontSize="sm">
          Explore Blockchains.
        </Text>
      </Link>
      <Link onClick={handleToAssets}>
        <Text color="gray.500" fontSize="sm">
          Explore Assets.
        </Text>
      </Link>
      <Link onClick={handleToNodes}>
        <Text color="gray.500" fontSize="sm">
          Explore Nodes.
        </Text>
      </Link>
      <Link onClick={handleToPioneers}>
        <Text color="gray.500" fontSize="sm">
          Explore other Pioneers.
        </Text>
      </Link>
      <Link href="https://pioneers.dev/docs" isExternal>
        <Text color="gray.500" fontSize="sm">
          Developer? use our api! https://pioneers.dev/docs
        </Text>
      </Link>
    </Grid>
  );
};

export default SomeText;
