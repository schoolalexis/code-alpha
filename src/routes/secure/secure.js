var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var qrCode = require("qrcode");

const verifToken = require("../auth/verifToken");
const interveners = require("../../models/interveners");
const interventions = require("../../models/interventions");

// WORK => QRCode interventions timeEntry/timeExit
function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join("/");
}

function formatHour(date) {
    return [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
    ].join(":");
}

// GET => Show page DEMO /SECURE
router.get("/", verifToken, (req, res, next) => {
    res.send("Simple page !");
});

// GET => Show all interveners
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

// GET => Show all interventions
router.get("/interventions", verifToken, (req, res, next) => {
    var isConnect = false;
    var token = req.cookies["x-access-token"];
    if (token) {
        isConnect = true;
    }

    interventions.find({}, (err, result) => {
        if (err) return res.status(500).send("Error interventions show!");
        if (!result) return res.status(400).send("Database empty !");
        res.render("interventions", {
            intervention: result,
            status: isConnect,
        });
    });
});

// POST => Create intervention
router.post("/intervention", (req, res, next) => {
    const { code, room } = req.body;
    if (!(code && room)) return res.send("All input are required !");

    let time = new Date();
    let dataDate = formatDate(time);
    let dataTime = formatHour(time);

    interventions.create(
        {
            code: req.body.code,
            room: req.body.room,
            dateInterv: dataDate,
            timeInterv: dataTime,
            timeEntry: "",
            timeExit: "",
        },
        (err, result) => {
            if (err) return res.status(500).send("Error intervention show!");
            if (!result) return res.status(400).send("Database empty !");

            // SEND EMAIL
            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "<user>",
                    pass: "<password>",
                },
            });

            // GENERATE QRCode
            let data =
                "<ip>:3000/secure/interventionUpdate?code=" +
                code +
                "&room=" +
                room;
            qrCode.toDataURL(data, function (err, qrCodeIMG) {
                if (err) return console.log("error occurred");

                var mailOptions = {
                    from: '"Test Team" <email>',
                    to: "<email>",
                    subject: "Intevention !",
                    text: "Intervention create !",
                    html:
                        '<img src="' +
                        qrCodeIMG +
                        '" alt="QRCode intervention" />',
                };

                transport.sendMail(mailOptions, (error, info) => {
                    if (error) return console.log(error);
                    console.log("Message sent: %s", info.messageId);
                });
            });
            res.status(200).json(result);
        }
    );
});

// GET => Update intervention
router.get("/interventionUpdate", (req, res, next) => {
    let time = new Date();
    let dataTime = formatHour(time);

    interventions.findOne(
        { room: req.query.room, code: req.query.code },
        (err, result) => {
            if (err) return res.status(500).send("Erreur intervention find !");
            if (!result)
                return res.status(400).send("Intervention not found !");
            console.log(result);
            if (result.timeEntry == "") {
                console.log(dataTime);
                interventions.updateOne(
                    { room: req.query.room, code: req.query.code },
                    {
                        timeEntry: dataTime,
                    },
                    (err, result) => {
                        if (err)
                            return res
                                .status(500)
                                .send("Erreur intervention update !");
                        if (!result)
                            return res
                                .status(400)
                                .send("Intervention not found !");
                        res.status(200).json(result);
                    }
                );
            } else if (result.timeEntry != "" && result.timeExit == "") {
                console.log(dataTime);
                interventions.updateOne(
                    { room: req.query.room, code: req.query.code },
                    {
                        timeExit: dataTime,
                    },
                    (err, result) => {
                        if (err)
                            return res
                                .status(500)
                                .send("Erreur intervention update !");
                        if (!result)
                            return res
                                .status(400)
                                .send("Intervention not found !");
                        res.status(200).json(result);
                    }
                );
            } else {
                res.status(200).send("Intervention is already over !");
            }
        }
    );
});

module.exports = router;
