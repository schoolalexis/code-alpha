var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

const interveners = require("../../models/interveners");

// GET => PAGE ROOT
router.get("/", (req, res, next) => {
    var token = req.cookies["x-access-token"];
    var isConnect = false;
    if (token) {
        isConnect = true;
    }
    res.render("auth", {
        status: isConnect,
    });
});

// POST => CREATE UNIQUE intervener
router.post("/register", (req, res, next) => {
    const { name, lastName, code, email, poste } = req.body;

    if (!(name && lastName && code && email && poste))
        return res.status(400).send("All input are required !");

    interveners.create(
        {
            ...req.body,
        },
        (err, result) => {
            if (err)
                return res
                    .status(500)
                    .send("Error intervener (unique) create !");
            if (!result) return res.status(400).send("Error ?!");
            res.status(200).send(result);
        }
    );
});

// POST => LOGIN
router.post("/login", (req, res, next) => {
    const { email, code } = req.body;

    if (!(email && code))
        return res.status(400).send("All input are required !");

    interveners.findOne({ email: req.body.email }, (err, result) => {
        if (err) return res.status(500).send("Error login !");
        if (!result) return res.status(400).send("Intervener not found !");

        var passwordIsValid = req.body.code == result.code;
        console.log(req.body.code);
        console.log(result.code);
        if (!passwordIsValid)
            return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ id: result._id }, "RANDOM", {
            expiresIn: "1h",
        });

        res.cookie("x-access-token", token);
        res.status(200).send({ auth: true, token: token });
    });
});

// GET => LOGOUT
router.get("/logout", (req, res, next) => {
    res.clearCookie("x-access-token");
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;
