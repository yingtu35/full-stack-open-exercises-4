const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post("/", async (request, response, next) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })
    try {
        const returnedBlog = await blog.save()
        response.status(201).json(returnedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete("/:id", async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogRouter.put("/:id", async (request, response, next) => {
    const body = request.body
    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }
    const opts = {
        new: true,
        runValidators: true
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, opts)
        if (updatedBlog) {
            response.status(200).json(updatedBlog)
        }
        else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogRouter