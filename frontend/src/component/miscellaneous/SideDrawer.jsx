import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Input, useDisclosure, useToast, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../context/ChatProvider'
import ProfileModel from './ProfileModel'
import { useHistory } from 'react-router-dom'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from '../useravtar/UserListItem'


const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchresult, setSearchresult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingchat, setLoadingchat] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, chats, setChats, setSelectedchat, selectedchat
    } = ChatState();

    // console.log(ChatState().chat)
    const history = useHistory()
    const logouthandler = () => {
        localStorage.removeItem('userInfo')
        history.push("/")
    }
    const toast = useToast()
    const handlesearch = async () => {
        if (!search) {
            toast({
                title: "please enter something search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"

            })
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,

                },
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchresult(data)
            // console.log(data)
        }
        catch (error) {
            toast({
                title: "error occured",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left"

            })
        }

    }
    const accesschat = async (userId) => {

        try {
            setLoadingchat(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json"
                },
            }
            const { data } = await axios.post("/api/chat/", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedchat(data)
            setLoadingchat(false)

            onClose()
        }
        catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
    const btnRef = React.useRef()
    return (


        <>
            <Box
                d="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="#141723"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="1px"
                color={"white"}
                borderRadius="20px"
                bgGradient={"linear(to-r, #FF0080,#31344c)"}
            >
                <Tooltip label="Search User to Chat" hasArrow placeContent={"bottom-end"}

                >

                    <Button variant={'ghost'} _hover={{ bg: "#e994bf", color: " white" }} onClick={onOpen}>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <Text d={{ base: "none", md: 'flex' }} px='4'>
                            search user
                        </Text>
                    </Button>

                </Tooltip>
                <Text fontSize={'2xl'} >
                    Podcast
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize={"2xl"} m={1} />

                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton  >
                            <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList color={"white"} background={"#141723"}>
                            <ProfileModel user={user}>
                                <MenuItem
                                    _hover={{ bg: "blue.500", color: " white" }}
                                >My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem
                                _hover={{ bg: "blue.500", color: " white" }}
                                border
                                onClick={logouthandler}>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}

            >
                <DrawerOverlay />
                <DrawerContent bg="#141723"
                    colorScheme={"white"}>
                    {/* <DrawerCloseButton /> */}
                    <DrawerHeader color={"white"}>Search</DrawerHeader>

                    <DrawerBody>
                        <Box
                            d="flex"
                            pb={2}

                        >
                            <Input
                                placeholder={"search by name or email"}
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                color="white"
                            />
                            <Button colorScheme={"blue"} onClick={handlesearch}>
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchresult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accesschat(user._id)}
                                />
                            ))
                        )}
                        {loadingchat && <Spinner m='auto' />}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            _hover={{ bg: "blue.500", color: " white" }}
                            variant='outline' colorScheme={"blue"} mr={3} onClick={onClose}>
                            Cancel
                        </Button>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer