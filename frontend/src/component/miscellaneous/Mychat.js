import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, useToast,Text } from '@chakra-ui/react';
import  axios  from 'axios';
import React, { useEffect, useState } from 'react'
import { getsender } from '../../config/chatlogic';
import {ChatState} from '../../context/ChatProvider';
import Chatbox from './Chatbox';
import ChatLoading from './ChatLoading';
import GroupChatModel from './GroupChatModel';


const Mychat = ({fetchAgain}) => {
  let temp;
  const {user,
        setUser,
        selectedchat,
         setSelectedchat,
         chats,
          setChats} = ChatState();
          const [loggeduser, setLoggeduser] = useState();
          const toast = useToast()
        

          const fetchChats = async () => {
            try {
      // console.log(user.token);
      const config = {
              
        headers: {
                    Authorization: `Bearer ${user.token}`,

                },

            }

          
            const {data}  = await axios.get("/api/chat", config);
            setChats(data)
            console.log(data,"data")
            console.log(chats,"chars")
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error)
    }
  };
  
   useEffect( () => {
    setLoggeduser(JSON.parse(localStorage.getItem("userInfo")));
     fetchChats();
     
    // eslint-disable-next-line
  },[fetchAgain]);
  return (
    
    <Box
     d={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#141723"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
      pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color={"white"}
      >
       Mychat
       <GroupChatModel>
          <Button

          colorScheme='blue'
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>  
      </Box>
    
     <Box
     d="flex"
        flexDir="column"
        p={3}
        
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
     >
      {chats?(
        <Stack  bg="" overflow={'scroll'}>
        {chats?.map((chat)=>(
          <Box
          _hover={{ bg: "green.500", color: " white" }}
          variant="solid"
          bgOpacity="25%"
           onClick={() => setSelectedchat(chat)}
                cursor="pointer"
                bg={selectedchat === chat ? "#38B2AC" : "#59546e"}
                color={selectedchat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                
          
          >
          <Text  color={"white"}>
             {!chat.isGroupChat?getsender(loggeduser,chat.users):(
               chat.chatName
             )

             }
          </Text>
          </Box>
        ))}
        </Stack>
      ):(<ChatLoading/>)}
     </Box>
  
    </Box>

  )
}

export default Mychat