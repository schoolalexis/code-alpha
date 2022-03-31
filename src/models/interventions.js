const mongoose = require("mongoose");
const { Schema } = mongoose;

const interventionsSchema = new Schema({
    code: { type: String, required: true },
    room: { type: String, required: true },
    dateInterv: { type: String, required: true },
    timeInterv: { type: String, required: true },
    timeEntry: { type: String, required: true },
    timeExit: { type: String, required: true },
});

const interventions = mongoose.model("interventions", interventionsSchema);

module.exports = interventions;
