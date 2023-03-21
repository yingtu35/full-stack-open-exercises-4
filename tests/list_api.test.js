const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const listHelper = require("./test.helper")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany()
    await Blog.insertMany(listHelper.initialBlogs)
})

describe("fetching blogs from the database", () => {
    test("succeeds and return as json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })

    test("received all blogs", async () => {
        const response = await api.get("/api/blogs")
        const blogs = response.body
        expect(blogs).toHaveLength(listHelper.initialBlogs.length)
    })
})

describe("unique identifier of blogs", () => {
    test("is id", async () => {
        const response = await api.get("/api/blogs")
        const firstBlog = response.body[0]
        expect(firstBlog.id).toBeDefined()
    })
})

describe("adding a new blog", () => {
    test("succeeds with valid form", async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
        }

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/)
        
        const response = await api.get("/api/blogs")
        const titles = response.body.map(blog => blog.title)
        expect(titles).toHaveLength(listHelper.initialBlogs.length+1)
        expect(titles).toContain(newBlog.title)
    })

    test("with missing like property will default to 0 likes", async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
        }

        const response = await api
            .post("/api/blogs")
            .send(newBlog)
        const returnedBlog = response.body
        expect(returnedBlog.likes).toBe(0)
    })

    test("with missing title property will return 400", async () => {
        const newBlog = {
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
        }

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(400)
    })

    test("with missing url property will return 400", async () => {
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            likes: 7
        }

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(400)
    })
})

describe("deleting a blog", () => {
    test("return 204 with valid id that exists in the database", async () => {
        const response = await api.get("/api/blogs")
        const firstBlog = response.body[0]
        
        await api
            .delete(`/api/blogs/${firstBlog.id}`)
            .expect(204)
    })

    test("return 204 with valid id that doest not exists in the database", async () => {
        const id = await listHelper.nonExistingId()
        
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)
    })

    test("return 400 with malformatted id", async () => {
        const malformattedId = "123"
        
        await api
            .delete(`/api/blogs/${malformattedId}`)
            .expect(400)
    })
})

describe("updating a blog", () => {
    test("succeeds with existing id and return the updated blog", async () => {
        const response = await api.get("/api/blogs")
        const firstBlog = response.body[0]
        console.log(firstBlog)
        const newBlog = {
            ...firstBlog,
            likes: 500
        }

        const res = await api
            .put(`/api/blogs/${firstBlog.id}`)
            .send(newBlog)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const returnedBlog = res.body
        
        expect(returnedBlog.likes).toBe(newBlog.likes)
    })

    test("fails with status 404 for non-existing id", async () => {
        const id = await listHelper.nonExistingId()
        
        await api
            .put(`/api/blogs/${id}`)
            .expect(404)
    })

    test("fails with status 400 for malformatted id", async () => {
        const id = "123"
        
        await api
            .put(`/api/blogs/${id}`)
            .expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})