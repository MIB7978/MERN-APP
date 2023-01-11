import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { SingleChat } from '../SingleChat'

const Chatbox = ({ fetchAgain, setFetchAgain }) => {

    const { selectedchat } = ChatState()
    return (

        <Box
            d={{ base: selectedchat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="#141723"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            opacity={"85%"}
            color="white"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchagain={setFetchAgain} />

        </Box>
    )
}

export default Chatbox