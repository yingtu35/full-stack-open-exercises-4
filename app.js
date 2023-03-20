// const http = require("http")

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogRouter = require("./controllers/blogs")
const config = require("./utils/config")
const morgan = require("morgan")
const middleware = require("./utils/middleware")

morgan.token("body", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
})

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
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use("/api/blogs", blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app