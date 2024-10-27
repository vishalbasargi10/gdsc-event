const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { authenticateToken, isAdmin } = require("../middleware/auth"); // Import both middlewares

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new event (Only authenticated users)
router.post("/", authenticateToken, async (req, res) => {
  const { image, title, date, time, location, shortDescription, description } = req.body;
  try {
    const newEvent = new Event({ image, title, date, time, location, shortDescription, description });
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an event (Only admin users)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "Request body cannot be empty" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an event (Only admin users)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Event not found" });
    
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err); // Log the error for server-side debugging
    res.status(500).json({ error: err.message || "An unexpected error occurred" });
  }
});

// POST register for an event
router.post("/:eventId/register", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id; // Make sure req.user is set by your authenticateToken middleware

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Initialize registeredUsers if it's undefined
    if (!event.registeredUsers) {
      event.registeredUsers = [];
    }

    // Register user if not already registered
    if (!event.registeredUsers.includes(userId)) {
      event.registeredUsers.push(userId);
      await event.save();
      res.status(200).json({ message: "Registered successfully" });
    } else {
      res.status(400).json({ message: "User already registered" });
    }
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET registered events for a specific user
router.get('/registered/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId; // Use userId from the request params

  console.log("Fetching events for user ID:", userId); // Debugging log

  try {
    const events = await Event.find({ registeredUsers: userId });
    return res.json(events);
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
