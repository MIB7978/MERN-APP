import React, { useEffect, useState } from 'react'
import axios from 'axios'

import SideDrawer from '../component/miscellaneous/SideDrawer'
import {Box} from '@chakra-ui/react'
import  {ChatState}  from "../context/ChatProvider"
import Mychat from '../component/miscellaneous/Mychat'
import Chatbox from '../component/miscellaneous/Chatbox'

const Chatpage = () => {
    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)
  return (
      <div style={{width:"100%"}}>
        {user && <SideDrawer/>}
        <Box
         d="flex"
         justifyContent={"space-between"}
         w="100%"
         h="91.5vh"
         p="10px"
        >
          {user && <Mychat fetchAgain={fetchAgain}/>}
          {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>

    </div>
  )
}

export default Chatpage