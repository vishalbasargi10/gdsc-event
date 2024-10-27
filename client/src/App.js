// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom"; // Remove BrowserRouter here
import EventsList from "./components/EventsList";
import EventDetail from "./components/EventDetail";
import AddEvent from "./components/AddEvent";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import EditEvent from "./components/EditEvent";
import Footer from "./components/Footer";
const App = () => (
  <AuthProvider>
    <Navbar /> 
    <Routes>
      <Route path="/" element={<EventsList />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/event/edit/:eventId" element={<EditEvent />} />
      <Route
        path="/add-event"
        element={
          <ProtectedRoute>
            <AddEvent />
          </ProtectedRoute>
        }
      />
    </Routes>
    <Footer />
  </AuthProvider>
);

export default App;
