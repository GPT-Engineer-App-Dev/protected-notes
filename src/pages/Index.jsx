import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, Button, Input, VStack, Text, useToast, extendTheme } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.800",
      },
    },
  },
});

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("supabase.auth.token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    const response = await fetch("https://mnwefvnykbgyhbdzpleh.supabase.co/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("supabase.auth.token", data.access_token);
      setIsLoggedIn(true);
      window.location.href = "/notes";
      toast({
        title: "Login Successful",
        description: "You've successfully logged in.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Login Failed",
        description: data.error_description || "Something went wrong.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("supabase.auth.token");
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You've successfully logged out.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        {!isLoggedIn ? (
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Login to your account
            </Text>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Welcome!
            </Text>
            <Button rightIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </VStack>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default Index;
