const mongoose = require("mongoose");
const { Schema } = mongoose;

const interventionsSchema = new Schema({
    code: { type: Number, required: true },
    room: { type: String, required: true },
    dateInterv: { type: String, required: true },
    timeInterv: { type: String, required: true },
    timeEntry: { type: String, required: false },
    timeExit: { type: String, required: false },
});

const interventions = mongoose.model("interventions", interventionsSchema);

module.exports = interventions;
