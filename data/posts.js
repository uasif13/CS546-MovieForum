const {ObjectID} = require("mongodb");
const mongoCollections = require("../config/mongoCollections")
const posts = mongoCollections.posts
const movies = mongoCollections.movies
const users = mongoCollections.users
const comments = mongoCollections.comments

module.exports = {
    async createPost(movie,title,description) {
        if (!movie && typeof movie !== 'string') {
            throw "movie is not a valid input. Please provide a string"
        }
    }
}