const jwt = require('jsonwebtoken')

const generateToken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JSON_SECRET, {
        expiresIn: "15d"
    })

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    })

    return token;
}

module.exports = generateToken;