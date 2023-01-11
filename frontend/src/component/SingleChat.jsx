import { Box, color, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import UpdateGroupChatModel from './UpdateGroupChatModel';
import { getsender, getsenderFull } from '../config/chatlogic';
import ProfileModel from './miscellaneous/ProfileModel';
import axios from "axios"
import "../component/styles.css"
import { ScrollableChat } from './ScrollableChat';
import io from "socket.io-client"
const ENDPOINT = "http://localhost:5000"
var socket, selectedChatCompare;
export const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [typing, setTyping] = useState(false)
    const [istyping, setIstyping] = useState(false)
    const toast = useToast();

    const [socketconnected, setSocketconnected] = useState(false)
    const { user, selectedchat, setSelectedchat } = ChatState();
    const fetchMessage = async () => {
        if (!selectedchat) return;
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/message/${selectedchat._id}`, config)
            setLoading(false);
            setMessage(data)
            // console.log(data);
            socket.emit('join chat', selectedchat._id)
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }


    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                // setLoading(true)
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedchat
                }, config)
                setNewMessage("")
                setMessage([...message, data])
                socket.emit("new message", data)
                console.log(data);
            }
            catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }
    const typinghandler = (e) => {
        e.preventDefault()
        setNewMessage(e.target.value)
        if(!socketconnected) return;
        if(!typing){
            setTyping(true)
            socket.emit('typing',selectedchat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerlength= 3000
        setTimeout(()=>{
            var timeNow  ;
        },timerlength)
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connection', () => setSocketconnected(true))
        socket.on("typing",()=>setIstyping(true))
        socket.on("stop typing",()=>setIstyping(false))
    }, [])

    useEffect(() => {

        fetchMessage()
        selectedChatCompare = selectedchat

    }, [selectedchat])
    useEffect(() => {
        socket.on("message recieved", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived._id) {
                // give notification
            }
            setMessage([...message, newMessageReceived])

        })
    })


    return (
        <>
            {
                selectedchat ? (<>

                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center">


                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ViewIcon />}
                            colorScheme={"blue"}
                            onClick={() => setSelectedchat("")}
                        />

                        {!selectedchat.isGroupChat ? (
                            <>
                                {getsender(user, selectedchat.users)}
                                <ProfileModel user={getsenderFull(user, selectedchat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedchat.chatName.toUpperCase()}
                                <UpdateGroupChatModel
                                    fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessage={fetchMessage} />
                            </>
                        )}
                    </Text>
                    <Box
                        d="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="10px"
                        // overflowY="hidden"
                        bgColor={"#120e18"}
                    // bgColor={"white"}
                    >
                        {loading ? (<Spinner
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                            color='pink'
                        />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat message={message} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <Input
                                variant={"filled"}
                                bg="#141723"
                                placeholder='enter message'
                                onChange={typinghandler}
                                value={newMessage}
                                _hover={{ bg: "#141746", color: "white" }} />
                        </FormControl>
                    </Box>






                </>
                ) : (

                    <Box d="flex" alignItems={"center"} justifyContent="center" h="100%">
                        <Text fontSize={"3xl"} pb={3} fontFamily="Work sans" >
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}
