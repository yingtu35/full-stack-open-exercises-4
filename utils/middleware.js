const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userExtractor = async (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        res.status(401).send({ error: "token invalid" })
    }
    else {
        const user = await User.findById(decodedToken.id)
        req.user = user
        next()
    }
}

const tokenExtractor = (req, res, next) => {
    let authorization = req.get("authorization")
    if (authorization && authorization.startsWith("Bearer ")) {
        authorization = authorization.replace("Bearer ", "")
    }
    req.token = authorization
    next()
}

const unknownEndpoint = (req, res) => {
    logger.error("unknown endpoint")
    res.status(404).send({error: "unknown endpoint"})

}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)
    if (err.name === "ValidationError") {
        res.status(400).send({error: err.message})
    }
    else if (err.name === "CastError") {
        res.status(400).send({error: "malformatted id"})
    }
    else if (err.name === "TokenExpiredError") {
        res.status(400).send({error: "token expired"})
    }
    else if (err.name === "JsonWebTokenError") {
        res.status(400).send({error: "token missing"})
    }
    next(err)
}

module.exports = {
    userExtractor, tokenExtractor, unknownEndpoint, errorHandler
}