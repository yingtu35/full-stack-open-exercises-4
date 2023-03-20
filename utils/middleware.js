const logger = require("./logger")

const unknownEndpoint = (req, res, next) => {
    res.status(404).send({error: "unknown endpoint"})

}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)
    if (err.name === "ValidationError") {
        res.status(400).send({error: "title and url are required"})
    }
    next(err)
}

module.exports = {
    unknownEndpoint, errorHandler
}