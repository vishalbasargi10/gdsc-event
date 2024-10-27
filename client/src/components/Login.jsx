import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const LoginContainer = styled.div`
  max-width: 400px;
  margin: 50px auto; /* Adjusted margin for spacing above and below */
  padding: 20px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Heading = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

// Add a Background to the whole page
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4285f4, #34a853);
  z-index: -1; /* Send it behind other components */
  animation: colorShift 7s ease-in-out infinite;

  @keyframes colorShift {
    0% { background: linear-gradient(135deg, #4285f4, #34a853); }
    50% { background: linear-gradient(135deg, #fbbc05, #ea4335); }
    100% { background: linear-gradient(135deg, #4285f4, #34a853); }
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Trim the username and password
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: trimmedUsername,
        password: trimmedPassword,
      });
      login(response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <Background />
      <LoginContainer>
        <Heading>Login</Heading>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Login</Button>
        </Form>
      </LoginContainer>
    </>
  );
};

export default Login;
