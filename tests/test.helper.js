const Blog = require("../models/blog")

const initialBlogs = [
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }  
]

const nonExistingId = async () => {
    const nonExistingBlog = {
        title: "nonexisting blog",
        author: "Ying Tu",
        url: "http://nonexistingblog.com",
        likes: 0
    }
    const blog = new Blog(nonExistingBlog)
    const returnedBlog = await blog.save()
    const id = returnedBlog.id
    await Blog.findByIdAndDelete(id)
    return id
}

module.exports = {
    initialBlogs, nonExistingId
}