const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const helper = require("./test.helper")

const api = supertest(app)

beforeEach(async () => {
    await helper.initializeUsers()
})

describe("user authentication", () => {
    test("succeeds with existing username and correct password, receive a token and correct username", async () => {
        const loginInfo = {
            username: "root",
            password: "root"
        }

        const response = await api
            .post("/api/login")
            .send(loginInfo)
            .expect(200)
            .expect("Content-Type", /application\/json/)
        const userInfo = response.body
        expect(userInfo.token).toBeDefined()
        expect(userInfo.username).toBe(loginInfo.username)

    })
    test("fails with existing username but incorrect password, return 401 and proper message", async () => {
        const loginInfo = {
            username: "root",
            password: "wrongPassword"
        }

        const response = await api
            .post("/api/login")
            .send(loginInfo)
            .expect(401)

        expect(response.body.error).toBe("Invalid username or password")
    })
    test("fails and return 401 with non-existing username", async () => {
        const loginInfo = {
            username: "nonExistingUser",
            password: "wrongPassword"
        }

        const response = await api
            .post("/api/login")
            .send(loginInfo)
            .expect(401)

        expect(response.body.error).toBe("Invalid username or password")
    })
})

afterAll(() => {
    mongoose.connection.close()
})