const info = (message) => {
    if (process.env.NODE_ENV === "test") {
        console.log(message)
    }
}

const error = (error) => {
    if (process.env.NODE_ENV === "test") {
        console.log(error)
    }
}

module.exports = {
    info, error
}