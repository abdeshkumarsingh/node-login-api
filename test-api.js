const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000/v1';

// Store token for authentication
let authToken = '';

// Helper function to log responses
const logResponse = async (response) => {
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  return response.data;
};

// Test API health check
const testHealthCheck = async () => {
  console.log('\n1. Testing Health Check Endpoint');
  console.log('GET', `${BASE_URL}/health`);
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return await logResponse(response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Test user creation
const testCreateUser = async () => {
  console.log('\n2. Testing Create User Endpoint');
  console.log('POST', `${BASE_URL}/users`);
  
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  console.log('Request Body:', JSON.stringify(userData, null, 2));
  
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return await logResponse(response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Test user login
const testLoginUser = async () => {
  console.log('\n3. Testing Login User Endpoint');
  console.log('POST', `${BASE_URL}/users/login`);
  
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  console.log('Request Body:', JSON.stringify(loginData, null, 2));
  
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await logResponse(response);
    
    if (data.status === 'success' && data.data.token) {
      authToken = data.data.token;
      console.log('Token obtained successfully');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Test get all users
const testGetAllUsers = async () => {
  console.log('\n4. Testing Get All Users Endpoint');
  console.log('GET', `${BASE_URL}/users`);
  console.log('Authorization:', `Bearer ${authToken}`);
  
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return await logResponse(response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Test get user by ID
const testGetUserById = async (userId) => {
  console.log('\n5. Testing Get User By ID Endpoint');
  console.log('GET', `${BASE_URL}/users/${userId}`);
  console.log('Authorization:', `Bearer ${authToken}`);
  
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return await logResponse(response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Test update user
const testUpdateUser = async (userId) => {
  console.log('\n6. Testing Update User Endpoint');
  console.log('PATCH', `${BASE_URL}/users/${userId}`);
  
  const updateData = {
    name: 'Updated Test User'
  };
  
  console.log('Request Body:', JSON.stringify(updateData, null, 2));
  console.log('Authorization:', `Bearer ${authToken}`);
  
  try {
    const response = await axios.patch(`${BASE_URL}/users/${userId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return await logResponse(response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Test delete user
const testDeleteUser = async (userId) => {
  console.log('\n7. Testing Delete User Endpoint');
  console.log('DELETE', `${BASE_URL}/users/${userId}`);
  console.log('Authorization:', `Bearer ${authToken}`);
  
  try {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    return await logResponse(response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Run all tests
const runTests = async () => {
  console.log('=== TESTING API ENDPOINTS ===');
  
  await testHealthCheck();
  const createResult = await testCreateUser();
  let userId = '';
  
  if (createResult && createResult.status === 'success') {
    userId = createResult.data.user._id;
    console.log('Created User ID:', userId);
    
    await testLoginUser();
    
    if (authToken) {
      await testGetAllUsers();
      await testGetUserById(userId);
      await testUpdateUser(userId);
      await testDeleteUser(userId);
    }
  }
  
  console.log('\n=== TESTING COMPLETED ===');
};

// Execute tests
runTests().catch(console.error); 