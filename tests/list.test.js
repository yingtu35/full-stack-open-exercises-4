const listHelper = require("../utils/list_helper")

const listWithOneBlog = [{
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
}]

const listWithMultipleBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
]

test("dummy value is one", () => {
    const blogs = []
    const result = listHelper.dummy(blogs)

    expect(result).toBe(1)
})

describe("Total likes", () => {

    test("of empty blog list is zero", () => {
        const totalLikes = listHelper.totalLikes([])
        
        expect(totalLikes).toBe(0)
    })

    test("of one blog is likes of that blog", () => {
        const totalLikes = listHelper.totalLikes(listWithOneBlog)
        expect(totalLikes).toBe(7)
    })

    test("of multiple blogs is calculater correctly", () => {
        const totalLikes = listHelper.totalLikes(listWithMultipleBlogs)
    
        expect(totalLikes).toBe(36)
    })
})

describe("Favorite blog", () => {
    test("of empty blog is null", () => {
        const favoriteBlog = listHelper.favoriteBlog([])
        expect(favoriteBlog).toBeNull()
    })

    test("of one blog is the blog itself but reformatted", () => {
        const favoriteBlog = listHelper.favoriteBlog(listWithOneBlog)
        expect(favoriteBlog).toEqual({
            title: listWithOneBlog[0].title,
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes
        })
    })

    test("of multiple blogs is calculated correctly", () => {
        const favoriteBlog = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(favoriteBlog).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        })
    })
})