import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

// Styled Components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50; /* Dark blue for a modern look */
  padding: 15px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* More pronounced shadow */
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.h2`
  color: #ecf0f1; /* Light color for contrast */
  font-family: 'Arial', sans-serif;
  font-size: 1.8rem;
  margin: 0;
`;

const StyledLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  margin: 0 20px; /* Increased margin for spacing */
  font-weight: 500; /* Slightly lighter for better readability */
  font-size: 1.1rem; /* Slightly larger font size */

  &:hover {
    color: #f39c12; /* Bright orange on hover for a pop of color */
    text-decoration: underline; /* Underline on hover */
  }
`;

const AuthButton = styled.button`
  background-color: #e74c3c; /* Red for emphasis */
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #c0392b; /* Darker red on hover */
    transform: translateY(-2px); /* Slight lift on hover */
  }
`;

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <Nav>
      <LogoLink to="/">
        <Logo>GDSC Events</Logo>
      </LogoLink>
      <div>
        {/* Conditionally render the Events List link based on authentication status */}
        {isAuthenticated() && <StyledLink to="/">Events List</StyledLink>}
        {isAuthenticated() ? (
          <>
            <StyledLink to="/add-event">Add Event</StyledLink>
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          </>
        ) : (
          <>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/register">SignUp</StyledLink>
          </>
        )}
      </div>
    </Nav>
  );
};

export default Navbar;
