var jwt = require("jsonwebtoken");

// CHECK TOKEN FUNC
const verifyToken = (req, res, next) => {
    var token = req.cookies["x-access-token"];
    console.log(token);
    if (!token)
        return res
            .status(403)
            .send({ auth: false, message: "No token provided !" });

    jwt.verify(token, "RANDOM", (err, decoded) => {
        if (err)
            return res
                .status(500)
                .send({ auth: false, message: "Failed to auth !" });
        // console.log(decoded.id);
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
