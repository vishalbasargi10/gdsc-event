import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

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

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.85);
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

const EditEvent = () => {
  const { eventId } = useParams();
  const { isAuthenticated } = useAuth();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    shortDescription: "",
    image: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`https://gdsc-event.onrender.com/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const event = response.data;
        // Format the date to YYYY-MM-DD for the date input
        const formattedDate = new Date(event.date).toISOString().split("T")[0];
        
        setEventData({
          ...event,
          date: formattedDate,
        });
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(eventData.date);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      alert("The date cannot be in the past.");
      return;
    }

    if (!isAuthenticated()) {
      alert("You must be logged in to edit an event.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://gdsc-event.onrender.com/api/events/${eventId}`,
        eventData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Event updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating event:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Background />
      <Container>
        <Title>Edit Event</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Event Title"
            required
          />
          <Input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
          <Input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
          />
          <Input
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Event Location"
            required
          />
          <Input
            name="shortDescription"
            value={eventData.shortDescription}
            onChange={handleChange}
            placeholder="Short Description"
            required
          />
          <Input
            name="image"
            value={eventData.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <SubmitButton type="submit">Save Changes</SubmitButton>
        </Form>
      </Container>
    </>
  );
};

export default EditEvent;
