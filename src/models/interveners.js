const mongoose = require("mongoose");
const { Schema } = mongoose;

// https://mongoosejs.com/docs/guide.html
const intervenersSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    code: { type: Number, required: true },
    email: { type: String, required: true },
    poste: { type: String, required: true },
});

const interveners = mongoose.model("interveners", intervenersSchema);

module.exports = interveners;
