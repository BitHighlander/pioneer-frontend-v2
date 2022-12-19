import { Grid, Heading, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SomeText = () => {
  const navigate = useNavigate();
  const handleToLogin = () => navigate("/login");

  return (
    <Grid textAlign="center" gap={2}>
      <Link onClick={handleToLogin}>
        <Heading fontSize="2xl" fontWeight="extrabold">
          Pioneers.dev
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Exploring new Worlds....
        </Text>
      </Link>
    </Grid>
  );
};

export default SomeText;
