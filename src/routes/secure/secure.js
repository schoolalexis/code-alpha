var express = require("express");
var router = express.Router();

const verifToken = require("../auth/verifToken");
const interveners = require("../../models/interveners");
const interventions = require("../../models/interventions");

router.get("/", verifToken, (req, res, next) => {
    res.send("Simple page !");
});

router.get("/interveners", verifToken, (req, res, next) => {
    var isConnect = false;
    var token = req.cookies["x-access-token"];
    if (token) {
        isConnect = true;
    }

    interveners.find({}, (err, result) => {
        if (err) return res.status(500).send("Error interveners show!");
        if (!result) return res.status(400).send("Database empty !");
        res.render("interveners", {
            intervener: result,
            status: isConnect,
        });
    });
});

router.get("/interventions", verifToken, (req, res, next) => {
    var isConnect = false;
    var token = req.cookies["x-access-token"];
    if (token) {
        isConnect = true;
    }

    interventions.find({}, (err, result) => {
        if (err) return res.status(500).send("Error interveners show!");
        if (!result) return res.status(400).send("Database empty !");
        res.render("interventions", {
            intervention: result,
            status: isConnect,
        });
    });
});

// WORK => QRCode interventions timeEntry/timeExit
// function padTo2Digits(num) {
//     return num.toString().padStart(2, "0");
// }

// function formatDate(date) {
//     return [
//         padTo2Digits(date.getDate()),
//         padTo2Digits(date.getMonth() + 1),
//         date.getFullYear(),
//     ].join("/");
// }

// function formatHour(date) {
//     return [
//         padTo2Digits(date.getHours()),
//         padTo2Digits(date.getMinutes()),
//     ].join(":");
// }

module.exports = router;
