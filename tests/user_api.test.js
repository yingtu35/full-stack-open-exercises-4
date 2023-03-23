const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const helper = require("./test.helper")

const api = supertest(app)

beforeEach(async () => {
    await helper.initializeUsers()
})


describe("viewing users list", () => {
    test("return in json format", async () => {
        await api
            .get("/api/users")
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })
})

// TODO: add unique identifier test
describe("the unique identifier of a user", () => {
    test("is id", async () => {
        const users = await helper.usersInDb()
        const firstUser = users[0]

        expect(firstUser.id).toBeDefined()
    })
})
describe("adding a user", () => {  

    test("succeeds with valid form", async () => {
        const usersAtStart = await helper.usersInDb()
        
        const newUser = {
            username: "newUser",
            password: "newUser",
            name: "newUser"
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/)
        const savedUser = response.body
        const usersAtEnd = await helper.usersInDb()
        expect(savedUser.username).toBe(newUser.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1)
    })

    test("fails with duplicate username, return 400", async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "root",
            password: "root",
            name: "admin2"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("fails when username is missing, return 400", async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            password: "missingUsername",
            name: "admin2"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("fails when password is missing, return 400", async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "missingPassword",
            name: "admin2"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("fails when username less than 3 characters, return 400", async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "ro",
            password: "root",
            name: "admin2"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("fails when password less than 3 characters, return 400 with proper error", async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "passwordTooShort",
            password: "ro",
            name: "passwordTooShort"
        }

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        expect(response.body.error).toBe("password must be at least 3 characters")
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})