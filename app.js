// const http = require("http")

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogRouter = require("./controllers/blogs")
const config = require("./utils/config")

const mongoUrl = config.MONGODB_URL
console.log("Connecting to", mongoUrl)
mongoose.connect(mongoUrl)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log(error.message)
    })

app.use(cors())
app.use(express.json())
app.use("/api/blogs", blogRouter)

module.exports = app