import { Flex, Image } from "@chakra-ui/react";

const ICON_SIZE = 22;

const SomeImage = () => {
  return (
    <Flex marginY={4} justifyContent="center" alignItems="center" gridGap={2}>
      <Image
        src="/assets/pioneer.png"
        title="TypeScript"
        height='600'
        width='300'
      />
    </Flex>
  );
};

export default SomeImage;
