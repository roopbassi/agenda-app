const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the agenda tasks
const agendaSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    complete:{
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})

// Create model based on the schema
const Agenda = mongoose.model('Agenda', agendaSchema);

module.exports = Agenda;