// models/Event.js
const mongoose = require("mongoose");

// Define the Event schema
const EventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  registeredUsers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
});

// Check if the model is already defined to avoid OverwriteModelError
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

module.exports = Event;
