const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const helper = require("./test.helper")

const api = supertest(app)

beforeEach(async () => {
    //initialize user and blogs
    await helper.initializeBlogs()
})

describe("fetching blogs from the database", () => {
    test("succeeds and return as json", async () => {
        const authorization = await helper.getToken()
        await api
            .get("/api/blogs")
            .set("Authorization", authorization)
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })

    test("received all blogs", async () => {
        const authorization = await helper.getToken()
        const response = await api
            .get("/api/blogs")
            .set("Authorization", authorization)
        const blogs = response.body
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

    test("fails when token is invalid and return 401 with proper message", async () => {
        const authorization = await helper.getInvalidToken()
        const response = await api
            .get("/api/blogs")
            .set("Authorization", authorization)
            .expect(401)
        expect(response.body.error).toBe("token invalid")
    })
    test("fails when token is expired and return 400 with proper message", async () => {
        const authorization = await helper.getExpiredToken()
        const response = await api
            .get("/api/blogs")
            .set("Authorization", authorization)
            .expect(400)
        expect(response.body.error).toBe("token expired")
    })
    test("fails and return 400 when token is expired", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(400)
        expect(response.body.error).toBe("token missing")
    })
})

describe("unique identifier of blogs", () => {
    test("is id", async () => {
        const authorization = await helper.getToken()
        const response = await api
            .get("/api/blogs")
            .set("Authorization", authorization)
        const firstBlog = response.body[0]
        expect(firstBlog.id).toBeDefined()
    })
})

describe("adding a new blog", () => {
    test("succeeds with valid form and token provided", async () => {
        const authorization = await helper.getToken()
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
        }

        await api
            .post("/api/blogs")
            .set("Authorization", authorization)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/)
        
        const response = await api
            .get("/api/blogs")
            .set("Authorization", authorization)            
        const titles = response.body.map(blog => blog.title)
        expect(titles).toHaveLength(helper.initialBlogs.length+1)
        expect(titles).toContain(newBlog.title)
    })

    test("with missing like property will default to 0 likes", async () => {
        const authorization = await helper.getToken()
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
        }
        
        const response = await api
            .post("/api/blogs")
            .set("Authorization", authorization)            
            .send(newBlog)
        const returnedBlog = response.body
        expect(returnedBlog.likes).toBe(0)
    })

    test("with missing title property will return 400", async () => {
        const authorization = await helper.getToken()
        const newBlog = {
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
        }

        await api
            .post("/api/blogs")
            .set("Authorization", authorization)            
            .send(newBlog)
            .expect(400)
    })

    test("with missing url property will return 400", async () => {
        const authorization = await helper.getToken()
        const newBlog = {
            title: "React patterns",
            author: "Michael Chan",
            likes: 7
        }

        await api
            .post("/api/blogs")
            .set("Authorization", authorization)            
            .send(newBlog)
            .expect(400)
    })
})

describe("deleting a blog", () => {
    test("return 204 with valid id that exists in the database", async () => {
        const authorization = await helper.getToken()
        
        const blogsAtStart = await helper.blogsInDb()
        const firstBlog = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${firstBlog.id}`)
            .set("Authorization", authorization)            
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).not.toContainEqual(firstBlog)
    })
    
    test("return 403 with valid id that doest not exists in the database", async () => {
        const authorization = await helper.getToken()
        const id = await helper.nonExistingId()
        
        await api
            .delete(`/api/blogs/${id}`)
            .set("Authorization", authorization)            
            .expect(403)
    })

    test("return 400 with malformatted id", async () => {
        const authorization = await helper.getToken()
        const malformattedId = "123"
        
        await api
            .delete(`/api/blogs/${malformattedId}`)
            .set("Authorization", authorization)            
            .expect(400)
    })

    test("return 403 when trying to delete blog the user does not own with proper message", async () => {
        const authorization = await helper.getToken()
        const users = await helper.usersInDb()
        const anotherUser = users[1]
        const newBlog = new Blog({
            title: "another user's blog",
            author: anotherUser.name,
            url: "anotherUser.com/blog/1",
            likes: 0,
            user: anotherUser.id
        })
        const returnedBlog = await newBlog.save()

        await api
            .delete(`/api/blogs/${returnedBlog._id}`)
            .set("Authorization", authorization)            
            .expect(403)

        const blogAtEnd = await Blog.findById(returnedBlog._id)
        expect(blogAtEnd).toBeDefined()
    })
})

// TODO: Add token authorization
describe("updating a blog", () => {
    test("succeeds with existing id and return the updated blog", async () => {
        const authorization = await helper.getToken()
        const blogs = await helper.blogsInDb()         
        const firstBlog = blogs[0]
        const newBlog = {
            ...firstBlog,
            likes: 500
        }
        
        const res = await api
            .put(`/api/blogs/${firstBlog.id}`)
            .set("Authorization", authorization)            
            .send(newBlog)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const returnedBlog = res.body
        
        expect(returnedBlog.likes).toBe(newBlog.likes)
    })

    test("fails with status 404 for non-existing id", async () => {
        const authorization = await helper.getToken()
        const id = await helper.nonExistingId()
        const blogs = await helper.blogsInDb()         
        const firstBlog = blogs[0]
        
        await api
            .put(`/api/blogs/${id}`)
            .set("Authorization", authorization)
            .send(firstBlog)            
            .expect(404)
    })
        
    test("fails with status 400 for malformatted id", async () => {
        const authorization = await helper.getToken()
        const id = "123"
        const blogs = await helper.blogsInDb()         
        const firstBlog = blogs[0]
        
        await api
            .put(`/api/blogs/${id}`)
            .set("Authorization", authorization)
            .send(firstBlog)            
            .expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})