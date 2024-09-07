const { verify } = require("jsonwebtoken");
const express = require("express")
const app = express();

app.use(express.json())


const userValidateToken = async (req, res, next) => {
    const accessToken = req.header("userAccessToken");
    if (!accessToken) {
        return res.json({ error: "You have not logged in.. !!" })
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.user = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
}
const riderValidateToken = async (req, res, next) => {
    const accessToken = req.header("riderAccessToken");
    if (!accessToken) {
        return res.json({ error: "You have not logged in.. !!" })
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.rider = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
}

const adminValidateToken = async (req, res, next) => {
    const accessToken = req.header("adminAccessToken");
    if (!accessToken) {
        return res.json({ error: "You have not logged in.. !!" })
    }
    try {
        const validToken = verify(accessToken, process.env.SECRET_KEY);
        if (validToken) {
            req.admin = validToken;
            next();
        }
    }
    catch (e) {
        return res.json({ error: e.message });
    }
}

module.exports = { adminValidateToken, userValidateToken, riderValidateToken };