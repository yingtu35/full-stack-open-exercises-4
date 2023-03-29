const loginRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const bcrypt = require("bcrypt")

loginRouter.post("/", async (req, res) => {
    const body = req.body
    const user = await User.findOne({username: body.username})
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)
    
    if (!passwordCorrect) {
        return res.status(401).send({ error: "Invalid username or password" })
    }

    const payload = {
        username: user.username,
        name: user.name,
        id: user._id
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 60 * 60 })
    res.json({
        token: token,
        username: user.username,
        name: user.name
    })
})

module.exports = loginRouter
