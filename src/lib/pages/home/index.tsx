import { Grid } from "@chakra-ui/react";

import CTASection from "./components/CTASection";
import SomeImage from "./components/SomeImage";
import SomeText from "./components/SomeText";

const Home = () => {
  return (
    <Grid gap={4}>
      <CTASection />
      <SomeText />
      <SomeImage />
    </Grid>
  );
};

export default Home;
