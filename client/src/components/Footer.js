// src/components/Footer.js
import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  text-align: center;
  padding: 10px 20px; /* Slightly increased padding for height */
  font-size: 0.9rem;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterText = styled.span`
  margin: 0 15px; /* Increased spacing between text items */
  font-family: 'Roboto', sans-serif; /* New font family for a modern look */
  font-weight: 400; /* Normal font weight */
  font-size: 1rem; /* Slightly larger font size */
`;

const Footer = () => (
  <FooterContainer>
    <FooterText>Vishal Basargi</FooterText>
    <FooterText>Email: vishalrajkumarbasargi@gmail.com</FooterText>
    <FooterText>Phone: +91 9481685589</FooterText>
    <FooterText>USN: 1NT22CS213</FooterText>
  </FooterContainer>
);

export default Footer;
