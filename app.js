const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogRouter = require("./controllers/blogs")
const userRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const config = require("./utils/config")
const morgan = require("morgan")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")

morgan.token("body", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
})

mongoose.set("strictQuery", false)

logger.info("Connecting to", config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL)
    .then(() => {
        logger.info("Connected to MongoDB")
    })
    .catch(error => {
        logger.error(error.message)
    })

app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

if (process.env.NODE_ENV === "test") {
    const testRouter = require("./controllers/test")
    app.use("/api/test", testRouter)    
}

app.use(middleware.tokenExtractor)
app.use("/api/blogs", middleware.userExtractor, blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app