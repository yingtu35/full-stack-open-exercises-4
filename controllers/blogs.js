const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", ["username", "name", "id"])
    response.json(blogs)
})

blogRouter.post("/", async (request, response, next) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })
    try {
        const returnedBlog = await (await blog.save()).populate("user", ["username", "name", "id"])
        user.blogs = user.blogs.concat(returnedBlog._id)
        await user.save()
        response.status(201).json(returnedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete("/:id", async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    // console.log(blog.user)
    if (!blog || blog.user.toString() !== user._id.toString()) {
        return response.status(403).send({ error: "blog deletion forbidden" })
    }
    await Blog.deleteOne({_id: blog._id})
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== blog._id.toString())
    await user.save()
    response.status(204).end()
})

blogRouter.put("/:id", async (request, response, next) => {
    const body = request.body
    // const user = request.user
    // const userBlogs = user.blogs.map(blog => blog.toString())
    // const isUserBlog = userBlogs.includes(request.params.id)
    // if (!isUserBlog) {
    //     return response.status(403).send({ error: "blog update forbidden" })
    // }

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: body.user.id
    }
    const opts = {
        new: true,
        runValidators: true
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, opts).populate("user", ["username", "name", "id"])
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