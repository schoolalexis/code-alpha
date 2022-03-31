const mongoose = require("mongoose");
const process = require("process");
require("dotenv").config();
const { mongo_URI } = process.env;

exports.connect = () => {
    mongoose
        .connect(mongo_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Success connection !");
        })
        .catch((error) => {
            console.log("Connection failed !");
            console.log(error);
            process.exit(1);
        });
};
