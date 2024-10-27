import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// Animated Background with Softer, Faster Transitions
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8faadc 0%, #b9cbe8 100%);
  animation: gradient 8s ease-in-out infinite;
  z-index: -1;

  @keyframes gradient {
    0% {
      background: linear-gradient(135deg, #8faadc 0%, #b9cbe8 100%);
    }
    50% {
      background: linear-gradient(135deg, #a0b3d8 0%, #c1d4ec 100%);
    }
    100% {
      background: linear-gradient(135deg, #8faadc 0%, #b9cbe8 100%);
    }
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: rgba(66, 133, 244, 0.85); /* Slightly less opaque */
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #fff;
  font-family: 'Arial', sans-serif;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 8px;
`;

const Image = styled.img`
  width: 90%;
  max-width: 300px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin: 15px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e0e0e0;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.4;
  margin-top: 10px;
`;

const DetailItem = styled.p`
  margin: 5px 0;
  font-weight: 500;
  color: #fff;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #e0e0e0;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #ff4c4c;
`;

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event detail:", error);
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  if (loading) return <LoadingText>Loading...</LoadingText>;

  if (!event) return <ErrorText>Event not found.</ErrorText>;

  return (
    <>
      <Background />
      <Container>
        <Title>{event.title}</Title>
        <Image src={event.image} alt={event.title} />
        <Details>
          <DetailItem><strong>Date:</strong> {event.date}</DetailItem>
          <DetailItem><strong>Time:</strong> {event.time}</DetailItem>
          <DetailItem><strong>Location:</strong> {event.location}</DetailItem>
          <DetailItem>{event.description}</DetailItem>
        </Details>
      </Container>
    </>
  );
};

export default EventDetail;
