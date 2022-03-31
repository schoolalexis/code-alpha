var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
    var isConnect = false;
    var token = req.cookies["x-access-token"];
    if (token) {
        isConnect = true;
    }
    res.render("index", {
        title: "Welcome !",
        msg: "Demo page",
        status: isConnect,
    });
});

module.exports = router;
