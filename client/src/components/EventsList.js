import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

// Background with Google Color Gradient
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4285f4, #34a853);
  animation: colorShift 7s ease-in-out infinite;
  z-index: -1;

  @keyframes colorShift {
    0% { background: linear-gradient(135deg, #4285f4, #34a853); }
    50% { background: linear-gradient(135deg, #fbbc05, #ea4335); }
    100% { background: linear-gradient(135deg, #4285f4, #34a853); }
  }
`;

// Styled Components for Layout
const Container = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const FilterInput = styled.input`
  width: 40%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border 0.3s ease;

  &:focus {
    border-color: #4285f4;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const EventCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
`;

const EventTitle = styled.h3`
  color: #333;
  margin: 12px 0;
  font-size: 1.2rem;
`;

const EventDetails = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const DetailLink = styled(Link)`
  color: #4285f4;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* Centers the button horizontally */
  margin-top: 10px;
`;


const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  background-color: #4285f4;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a7ae4;
  }
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: none;
  background-color: ${({ $active }) => ($active ? "#4285f4" : "#ccc")};
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:disabled {
    background-color: #ddd;
    cursor: default;
  }
`;

const LoginMessage = styled.div`
  color: #ea4335;
  margin-top: 20px;
  text-align: center;
`;

const LoginButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a7ae4;
  }
`;

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://gdsc-event.onrender.com/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [navigate, isAuthenticated]);

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://gdsc-event.onrender.com/api/events/${eventId}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for the event.");
    }
  };

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://gdsc-event.onrender.com/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event.");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <Background />
      <Container>
        {!isAuthenticated() ? (
          <LoginMessage>
            <p>Please log in to see the events.</p>
            <LoginButton onClick={handleLoginRedirect}>Login Here</LoginButton>
          </LoginMessage>
        ) : (
          <>
            <FilterInput
              type="text"
              placeholder="Filter by title"
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
            <EventsGrid>
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <EventCard key={event._id}>
                    <EventImage src={event.image} alt={event.title} />
                    <EventTitle>{event.title}</EventTitle>
                    <EventDetails>
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Date not available"}{" "}
                      at{" "}
                      {event.date
                        ? new Date(event.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                        : "Time not available"}
                    </EventDetails>
                    <EventDetails>{event.location}</EventDetails>
                    <EventDetails>{event.shortDescription}</EventDetails>
                    <DetailLink to={`/event/${event._id}`}>View Details</DetailLink>
                    {userRole === "admin" ? (
                      <ButtonContainer>
                        <ActionButton onClick={() => navigate(`/event/edit/${event._id}`)}>Edit</ActionButton>
                        <ActionButton onClick={() => handleDelete(event._id)}>Delete</ActionButton>
                      </ButtonContainer>
                    ) : (
                      <ButtonContainer>
                        <ActionButton onClick={() => handleRegister(event._id)}>Register Now</ActionButton>
                      </ButtonContainer>
                    )}
                  </EventCard>
                ))
              ) : (
                <p>No events found.</p>
              )}
            </EventsGrid>

            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <PageButton
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  $active={currentPage === index + 1}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </PageButton>
              ))}
            </Pagination>
          </>
        )}
      </Container>
    </>
  );
};

export default EventsList;
