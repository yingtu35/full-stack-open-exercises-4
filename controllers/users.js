const userRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

userRouter.get("/", async (req, res) => {
    const users = await User.find({}).populate("blogs", ["url", "title", "author", "id"])
    res.json(users)
})

userRouter.post("/", async (req, res) => {
    const body = req.body
    if (!body.password || body.password.length < 3) {
        return res.status(400).send({
            error: "password must be at least 3 characters"
        })
    }
    const saltRounds = 10
    const newUser = new User({
        username: body.username,
        passwordHash: await bcrypt.hash(body.password, saltRounds),
        name: body.name
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
})

module.exports = userRouter