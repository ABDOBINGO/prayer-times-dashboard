import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Heading,
  HStack,
  Spinner,
  useColorModeValue,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';

// Use environment variable for backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleLogin = () => {
    if (password === process.env.REACT_APP_DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      fetchUsers();
    } else {
      toast({
        title: 'Error',
        description: 'Invalid password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*');
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const sendEmail = async (user) => {
    setSelectedUser(user.id);
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          language: user.language_preference,
          city: user.city
        }),
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      
      toast({
        title: 'Success',
        description: `Email sent to ${user.email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send email to ${user.email}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
    setSelectedUser(null);
  };

  const sendBulkEmails = async () => {
    setLoading(true);
    for (const user of users) {
      await sendEmail(user);
    }
    setLoading(false);
  };

  const calculateJummahCountdown = (city) => {
    const now = new Date();
    const friday = new Date();
    friday.setDate(friday.getDate() + ((7 - friday.getDay() + 5) % 7));
    friday.setHours(13, 0, 0, 0);
    
    const diff = friday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (!isAuthenticated) {
    return (
      <Container centerContent minH="100vh" py={10}>
        <Card p={8} borderRadius="lg" bg={bgColor} boxShadow="lg" width="100%" maxW="md">
          <CardBody>
            <VStack spacing={6}>
              <Heading size="lg" textAlign="center">Prayer Times Dashboard</Heading>
              <Text color="gray.600" textAlign="center">Enter your password to access the dashboard</Text>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
              <Button 
                colorScheme="blue" 
                onClick={handleLogin}
                width="100%"
                size="lg"
              >
                Login
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Box minH="100vh" p={5} bg="gray.50">
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg">Prayer Times Dashboard</Heading>
            <Button
              colorScheme="blue"
              onClick={sendBulkEmails}
              isLoading={loading}
              loadingText="Sending emails..."
              size="lg"
            >
              Send Emails to All Users
            </Button>
          </HStack>
          
          {loading && !selectedUser ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" />
              <Text mt={4}>Loading...</Text>
            </Box>
          ) : (
            <Card>
              <CardBody>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>
                        <Th>Language</Th>
                        <Th>City</Th>
                        <Th>Next Jummah</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <Tr key={user.id}>
                          <Td>{user.email}</Td>
                          <Td>
                            <Badge colorScheme={user.language_preference === 'ar' ? 'green' : 'blue'}>
                              {user.language_preference}
                            </Badge>
                          </Td>
                          <Td>{user.city}</Td>
                          <Td>{calculateJummahCountdown(user.city)}</Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="teal"
                              onClick={() => sendEmail(user)}
                              isLoading={loading && selectedUser === user.id}
                              loadingText="Sending..."
                            >
                              Send Email
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default App; 