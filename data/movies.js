const {ObjectID} = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;

function sProvided(param, paramName) {
    if (!param && typeof param !== "string") {
        throw `Invalid movie ${paramName}`
    }
}

module.exports = {
    async createMovie(title, description, genres, budget, image = 'no_image.jpg') {
        sProvided(title, "title")       
        sProvided(description, "description")       
        if (!Array.isArray(genres)) throw "Genres is not an array"
        sProvided(budget, "budget")
        // The rating is represented as [avg, count].
        // This is for update purpose
        let movie = {
            title: title,
            rating: [0,0],
            image: `../../public/assets/${image}`, 
            description: description,
            genres: genres,
            budget: budget
        }
        const moviesCollection = await movies();
        const insertInfo = await moviesCollection.insertOne(movie);
        if (insertInfo.inserted === 0) {
            throw 'Movie has not been inserted'
        }
        const movieID = insertInfo.insertedId;
        const addedMovie = await this.getMovie(movieID)
        return addedMovie;

    },
    async getMovie(id) {
        const parsedID = ObjectID(id)
        const movieCollection = await movies();
        const movie = await movieCollection.findOne({_id: parsedID});
        if (movie == null) {
            throw 'Could not find a movie with the given id'
        }
        return movie;
    },

    async getAllMovies() {
        const movieCollection = await movies();
        const allMovies = await movieCollection.find({}).toArray();
        return allMovies;
    },

    async updateMovieRating(id, rating) {
        const parsedID = Object(id);
        const movie = await this.getMovie(parsedID);
        const movieCollection = await movies();
        if (!rating && typeof rating != "number") {
            throw "rating is not a number";
        }
        if (rating < 0 || rating > 5) {
            throw "rating must be a number between 0 and 5 inclusive";
        }
        // Current average and count
        let avg = movie.rating[0];
        let count = movie.rating[1];
        // New average and count
        avg = (avg*count+rating)/count+1;
        count += 1;
        movie.rating = [avg, count];
        const updatedInfo = await movieCollection.updateOne({_id: parsedID},{$set: movie});
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update rating of movie';
        }
        const revisedMovie = await this.getMovie(parsedID);
        return revisedMovie;
    },
}