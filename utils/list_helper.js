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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}