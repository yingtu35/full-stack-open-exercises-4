var _ = require("lodash")

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((accumulator, blog) => {
        return accumulator + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const mostLikedBlog = blogs.reduce((mostLiked, cur) => {
        return mostLiked.likes > cur.likes ? mostLiked : cur
    })
    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const blogsCount = _.countBy(blogs, (blog) => blog.author)
    const blogsCountEntries = Object.entries(blogsCount)
    const maxBlogsAuthor = blogsCountEntries.reduce((acc, array) => array[1] > acc[1] ? array : acc)
    const res = {
        author: maxBlogsAuthor[0],
        blogs: maxBlogsAuthor[1]
    }
    return res
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorBlogs = _.groupBy(blogs, (blog) => blog.author)
    const authorBlogsEntries = Object.entries(authorBlogs)
    const authorLikes = authorBlogsEntries.map((array) => [array[0], array[1].reduce((acc, blog) => acc + blog.likes, 0)])
    const mostLikesAuthor = authorLikes.reduce((acc, array) => array[1] > acc[1] ? array : acc)
    const res = {
        author: mostLikesAuthor[0],
        likes: mostLikesAuthor[1]
    }
    return res
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}