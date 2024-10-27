import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

// Animated Background with Google Color Gradient
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4285F4, #34A853);
  animation: colorShift 7s ease-in-out infinite;
  z-index: -1;

  @keyframes colorShift {
    0% { background: linear-gradient(135deg, #4285F4, #34A853); }
    50% { background: linear-gradient(135deg, #FBBC05, #EA4335); }
    100% { background: linear-gradient(135deg, #4285F4, #34A853); }
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.85); /* Semi-transparent white */
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  font-family: 'Arial', sans-serif;
  margin-bottom: 15px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  transition: border 0.3s ease;

  &:focus {
    border: 1px solid #4285F4;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  resize: vertical;
  transition: border 0.3s ease;

  &:focus {
    border: 1px solid #4285F4;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #34A853;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #2e8b57;
    transform: scale(1.02);
  }
`;

const AddEvent = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    date: "",
    time: "",
    location: "",
    shortDescription: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      alert("You must be logged in to add an event.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://gdsc-event.onrender.com/api/events", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/"); // Redirect to the events list after adding
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <>
      <Background />
      <Container>
        <Title>Add New Event</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <TextArea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            required
          />
          <TextArea
            name="description"
            placeholder="Full Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <SubmitButton type="submit">Add Event</SubmitButton>
        </Form>
      </Container>
    </>
  );
};

export default AddEvent;
