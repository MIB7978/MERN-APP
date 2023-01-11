import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
} from '@chakra-ui/react'
import axios from "axios"
import { useDisclosure } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import UserListItem from '../useravtar/UserListItem'
import UserBadgeItem from '../userbadge/UserBadgeItem'
import { useHistory } from 'react-router-dom'

const GroupChatModel = ({ children }) => {
    const history = useHistory()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selecteduser, setSelecteduser] = useState([])
    const [search, setSearch] = useState()
    const [groupchat, setGroupchat] = useState()
    const [searchresult, setSearchresult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const { user, chats, setChats } = ChatState()
    const handleSearch = async (querry) => {
        setSearch(querry)
        console.log(querry);
        if (!querry) {
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
            console.log(data);
            setLoading(false)
            setSearchresult(data)

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
    const handleGroup = (userToAdd) => {
        if (selecteduser.includes(userToAdd)) {
            toast({
                title: "user already selected ",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"

            })
            return
        }
        setSelecteduser([...selecteduser, userToAdd])
    }
    const handleDelete = (delUser) => {
        setSelecteduser(selecteduser?.filter(sel => sel._id !== delUser._id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!groupchat || !selecteduser) {
            toast({
                title: "please fill all of the fields",
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
            const { data } = await axios.post("/api/chat/group", {
                name: groupchat,
                users: JSON.stringify(selecteduser.map((u) => u._id))
            }, config);

            setChats([data, ...chats])

            toast({
                title: `Group created  `,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-left"

            })

            onClose()
            // history.push("/chats")

        }
        catch (error) {
            toast({
                title: "some error occured",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left"

            })
            console.log(error)
        }

    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >Create Group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl >
                            <Input placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupchat(e.target.value)}
                            />
                        </FormControl>
                        <FormControl >
                            <Input placeholder='Add user'
                                value={search}
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box d="flex" w="100%" flexWrap="wrap">
                            {selecteduser?.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {loading ? <div>loading</div> : (
                            searchresult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => { handleGroup(user) }} />
                            ))
                        )

                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel