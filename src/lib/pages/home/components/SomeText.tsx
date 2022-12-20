import { Grid, Heading, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SomeText = () => {
  const navigate = useNavigate();
  const handleToDapps = () => navigate("/dapps");

  return (
    <Grid textAlign="center" gap={2}>
        <Heading fontSize="2xl" fontWeight="extrabold">
          Pioneers.dev
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Exploring new Worlds....
        </Text>
      <Link onClick={handleToDapps}>
        <Text color="gray.500" fontSize="sm">
          Explore Dapps.
        </Text>
      </Link>
      <Link onClick={handleToDapps}>
        <Text color="gray.500" fontSize="sm">
          Explore Blockchains.
        </Text>
      </Link>
      <Link onClick={handleToDapps}>
        <Text color="gray.500" fontSize="sm">
          Explore Assets.
        </Text>
      </Link>
      <Link onClick={handleToDapps}>
        <Text color="gray.500" fontSize="sm">
          Explore Nodes.
        </Text>
      </Link>
    </Grid>
  );
};

export default SomeText;
