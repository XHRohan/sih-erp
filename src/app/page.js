'use client';

import { useState, useEffect } from 'react';
import { Container, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import { initializeData } from '../utils/data';
import Dashboard from '../components/Dashboard';

// LoginForm component with role selection and user list
const LoginForm = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Initialize data and get users
    const data = initializeData();
    setAllUsers(data.users);
  }, []);

  useEffect(() => {
    // Filter users by selected role
    if (selectedRole) {
      const filteredUsers = allUsers.filter(user => user.role === selectedRole);
      setAvailableUsers(filteredUsers);
      setSelectedUser('');
    } else {
      setAvailableUsers([]);
      setSelectedUser('');
    }
  }, [selectedRole, allUsers]);

  const handleLogin = () => {
    if (selectedUser) {
      const user = availableUsers.find(u => u.id === selectedUser);
      if (user) {
        // Store user session in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          College ERP System
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="text.secondary">
          Please select your role and account to login
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              label="Select Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="alumni">Alumni</MenuItem>
            </Select>
          </FormControl>

          {selectedRole && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Account</InputLabel>
              <Select
                value={selectedUser}
                label="Select Account"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            disabled={!selectedUser}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};



// Main application component
export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on app load
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user session:', error);
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </>
  );
}
