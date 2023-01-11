import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const toast = useToast();
  const handleClick = () => {
    if (show === true) setShow(false);
    else setShow(true);
  };

  const postDetails = (pics) => {
    // setLoading(true);
    if (pics === undefined) {
      toast({
        title: "please select an image",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(pics);
      reader.onloadend = () => {
        setPicture(reader.result);
      };
    } else {
      toast({
        title: "please select an image",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
    // setLoading(false)
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !password || !email) {
      toast({
        title: "please fill all the details",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (password !== confirmPassword) {
      toast({
        title: "please write the password",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      let picurl;
      // const res =await  fetch("/api/user/pics",{
      //   method:"POST",
      //   headers:{
      //     "Content-Type":"application/json",
      //     "Accept":"application/json"
      //   },
      //   body: JSON.stringify({data:picture})
      // });
      // const json = await res.json();
      // picurl = json.url;
      const mongores = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          name: name,
        }),
      });
      const userjson = await mongores.json();
      console.log(userjson);
      localStorage.setItem("userInfo", JSON.stringify(userjson));
      history.push("/chats");
      setLoading(false);
    } catch (error) {
      toast({
        title: "some error occured",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="enter your name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="enter your email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="enter your password"
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem"  size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="confirm password"
            type={show ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>

      <Button
        w="100%"
        colorScheme={"blue"}
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
