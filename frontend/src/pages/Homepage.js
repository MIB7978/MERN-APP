import React, { useEffect } from "react";
import { Container, Box, Text, useDisclosure } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../component/authentication/Login";
import Signup from "../component/authentication/Signup";
import { useHistory } from "react-router-dom";
import { Fade, ScaleFade, Slide, SlideFade } from '@chakra-ui/react'
const Homepage = () => {
  const history = useHistory()
      const { isOpen, onToggle } = useDisclosure()

    useEffect(() => {
       const userInfo  = localStorage.getItem("userInfo")
       if(!userInfo)
       history.push("/");
    }, [history])
  return (
    
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        padding={3}
        bg="" color={"white"}
        w="100%"
        m="60px 0px 70px 0px"
        borderRadius="20px"
        borderWidth="1px"
        bgGradient={"linear(to-r, #FF0080,#31344c)"}
      >
        <Text fontSize="4xl" fontFamily="work sans" color="white">
          Podcast
        </Text>
      </Box>
      <Box
        bg="#131421" color={"white"}
        w={"100%"}
        p={4}
      
        borderWidth="1px"
        borderRadius="20px"
      >
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb={4}>
            <Tab w={"50%"}>Log In</Tab>
            <Tab w={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {" "}
              <Login />{" "}
            </TabPanel>
            <TabPanel>
              {" "}
              <Signup />{" "}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
