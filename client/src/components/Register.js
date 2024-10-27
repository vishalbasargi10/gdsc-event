import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 50px auto; /* Adjusted margin for spacing above and below */
  padding: 20px;
  background-color: #f9f9f9;
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

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #2ecc71;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    background-color: #95d5b2; /* Lighter shade for disabled state */
    cursor: not-allowed;
  }
`;

// Add a Background to the whole page
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e74c3c, #f1c40f);
  z-index: -1; /* Send it behind other components */
  animation: colorShift 7s ease-in-out infinite;

  @keyframes colorShift {
    0% { background: linear-gradient(135deg, #e74c3c, #f1c40f); }
    50% { background: linear-gradient(135deg, #3498db, #9b59b6); }
    100% { background: linear-gradient(135deg, #e74c3c, #f1c40f); }
  }
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Simple client-side validation
    if (trimmedUsername.length < 3 || trimmedPassword.length < 6) {
      setError("Username must be at least 3 characters and password at least 6 characters long.");
      setLoading(false); // Stop loading on error
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", {
        username: trimmedUsername,
        password: trimmedPassword,
        role,
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("Registration failed:", error.response.data);
        setError(error.response.data.message || "Registration failed. Please try again.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please try again.");
      } else {
        console.error("Error message:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <>
      <Background />
      <RegisterContainer>
        <Heading>Register</Heading>
        {error && <ErrorMessage>{error}</ErrorMessage>}
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
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>
      </RegisterContainer>
    </>
  );
};

export default Register;
