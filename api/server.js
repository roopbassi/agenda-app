const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app= express();

app.use(express.json());
app.use(cors());

// Connect to local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1/agenda", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB")).catch(console.error);

// Import agenda model
const Agenda = require("./models/agenda");

// Route handler uses Agenda model to fetch agendaItems from MongoDB
app.get("/agenda", async (req, res) => {
    const agendaItem = await Agenda.find();
    res.json(agendaItem);         // Retrieved items are sent back as JSON response
});

// Create agendaTtems by reading requests
app.post("/agenda/new", (req, res) => {
    const agendaItem = new Agenda ({
        text: req.body.text,
    });
    agendaItem.save();
    res.json(agendaItem); 
});

// Delete Route
app.delete("/agenda/delete/:name", async (req, res) => {
    const result = await Agenda.findByIdAndDelete(req.params.name);
    res.json({result});
});

// Update complete status
app.get("/agenda/complete/:name", async (req, res) => {
    const agendaItem = await Agenda.findById(req.params.name);
    agendaItem.complete = !agendaItem.complete;   // flip the result of complete
    agendaItem.save();
    res.json(agendaItem);
});

// Start server and listen for incoming req
app.listen(3001, () => {
    console.log("Server started on port 3001");
});