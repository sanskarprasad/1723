"use client"; // Add this line at the top

import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from "@chakra-ui/react";

const PortControlPage: React.FC = () => {
  const [currentPort, setCurrentPort] = useState(3306); // Default SQL port
  const [newPort, setNewPort] = useState("");

  const handleUpdatePort = () => {
    const port = parseInt(newPort, 10);
    if (!newPort || port < 0 || port > 65535) {
      alert("Please enter a valid port number between 0 and 65535.");
      return;
    }

    setCurrentPort(port); // Update the current port
    alert(`SQL port has been updated to ${port}`);
    setNewPort(""); // Reset the input field
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="50px"
      p="4"
      borderWidth="1px"
      borderRadius="lg"
      textAlign="center"
    >
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        SQL Port Control
      </Text>
      <Text fontSize="lg" mb="6">
        Current SQL Port: <strong>{currentPort}</strong>
      </Text>
      <VStack spacing="4">
        <FormControl>
          <FormLabel>New Port Number</FormLabel>
          <Input
            type="number"
            placeholder="Enter new SQL port"
            value={newPort}
            onChange={(e) => setNewPort(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" w="100%" onClick={handleUpdatePort}>
          Update Port
        </Button>
      </VStack>
    </Box>
  );
};

export default PortControlPage;
