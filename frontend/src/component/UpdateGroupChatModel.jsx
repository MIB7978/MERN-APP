import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>

            <IconButton colorScheme={'blue'} d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default UpdateGroupChatModel