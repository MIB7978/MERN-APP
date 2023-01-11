import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
   const [loading,setLoading] = useState(false)
   const history = useHistory();
   
  const handleClick = () => {
    if (show === true) setShow(false);
    else setShow(true);
  };
  const submitHandler = async(e) => {
       e.preventDefault();
        setLoading(true)
        if( !password || !email)
       {
          toast({
         title: "please fill all the details",
         status: "warning",
         duration: 9000,
         isClosable: true,
         position:"bottom"
       });
      }
      try{
    const response = await fetch("/api/user/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringify({email:email,password:password})
      
    })
    if(response)
    {
       toast({
         title: "login successful",
         status: "success",
         duration: 9000,
         isClosable: true,
         position:"bottom"
       }); 
        const userjson =await  response.json()
            console.log(userjson)
            localStorage.setItem("userInfo", JSON.stringify(userjson));
            
       history.push("/chats")
      //  localStorage.setItem()
    }
    else
    {
        toast({
         title: "Invalid credentials",
         status: "error",
         duration: 9000,
         isClosable: true,
         position:"bottom" 
          })
        }
        console.log(response)
  }
  catch(error)
  {
       toast({
         title: "some error occured",
         status: "error",
         duration: 9000,
         isClosable: true,
         position:"bottom" 
          })
  }
    setLoading(false)


  };
  return (
    <VStack spacing={"5px"} >
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="enter your email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            placeholder="enter your password"
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        w="100%"
        colorScheme={"blue"}
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
