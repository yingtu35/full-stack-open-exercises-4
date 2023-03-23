const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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

const initialUsers = [
    {
        username: "root",
        password: "root",
        name: "admin"
    },
    {
        username: "daniel",
        password: "daniel",
        name: "daniel"
    }
]

const initializeBlogs = async () => {
    await Blog.deleteMany()
    const users = await initializeUsers()
    const firstUser = users[0]
    const blogs = initialBlogs.map(blog => {
        return {
            ...blog,
            user: firstUser.id
        }
    })
    const returnedBlogs = await Blog.insertMany(blogs)
    const returnedIds = returnedBlogs.map(blog => blog._id)
    firstUser.blogs = firstUser.blogs.concat(returnedIds)
    await firstUser.save()
}

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

const initializeUsers = async () => {
    await User.deleteMany()
    const firstUser = new User({
        username: initialUsers[0].username,
        passwordHash: await bcrypt.hash(initialUsers[0].password, 10),
        name: initialUsers[0].name
    })
    await firstUser.save()
    const secondUser = new User({
        username: initialUsers[1].username,
        passwordHash: await bcrypt.hash(initialUsers[1].password, 10),
        name: initialUsers[1].name
    })
    await secondUser.save()
    const users = await User.find({})
    return users
}

const getToken = async () => {
    const firstUser = initialUsers[0]
    const user = await User.findOne({username: firstUser.username})
    
    const payload = {
        username: user.username,
        name: user.name,
        id: user._id
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 600 })
    const authorization = "Bearer " + token
    return authorization
}

const getInvalidToken = async () => {
    const firstUser = initialUsers[0]
    const user = await User.findOne({username: firstUser.username})
    
    const payload = {
        username: user.username,
        name: user.name,
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 600 })
    const authorization = "Bearer " + token
    return authorization
}

const getExpiredToken = async () => {
    const firstUser = initialUsers[0]
    const user = await User.findOne({username: firstUser.username})

    const payload = {
        username: user.username,
        name: user.name,
    }

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 0 })
    const authorization = "Bearer " + token
    return authorization
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}



module.exports = {
    initialBlogs, 
    initializeBlogs, 
    initializeUsers, 
    nonExistingId, 
    usersInDb, 
    blogsInDb,
    getToken, 
    getInvalidToken, 
    getExpiredToken
}