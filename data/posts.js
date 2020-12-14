const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const movieMethods = require("./movies");
const userMethods = require("./users");

function sProvided(param, paramName) {
  if (!param || typeof param !== "string") {
    throw `Invalid post ${paramName} since ${paramName} is not a string`;
  }
}
function aProvided(param, paramName) {
  if (!Array.isArray(param)) {
    throw `Invalid post ${paramName} since ${paramName} is not an array`;
  }
}
module.exports = {
  async createPost(movie, user, title, description, tags, images) {
    try {
      await movieMethods.getMovie(movie._id);
    } catch (e) {
      throw e;
    }
    try {
      await userMethods.getUserByID(user._id);
    } catch (e) {
      throw e;
    }
    sProvided(title, "title");
    sProvided(description, "description");
    aProvided(tags, "Tags");
    aProvided(images, "images");
    let post = {
      postTitle: title,
      postBody: description,
      postMovieId: movie._id,
      postReplies: [],
      postLikes: 0,
      postDislikes: 0,
      postuserId: user._id,
      postTags: tags,
      postImages: images,
    };
    const postCollection = await posts();
    const insertInfo = await postCollection.insertOne(post);
    if (insertInfo.inserted === 0) {
      throw "Post has not been inserted";
    }
    const postID = insertInfo.insertedId;
    const addedPost = await this.getPost(postID);
    return addedPost;
  },
  async getPost(postId) {
    const parsedID = ObjectID(postId);
    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: parsedID });
    if (post == null) {
      throw "Could not find a movie with the given id";
    }
    return post;
  },
  async getAllPosts() {
    const postCollection = await posts();
    const allPosts = await postCollection.find({}).toArray();
    return allPosts;
  },
  async getPostforMovie(movieId) {
    const parsedId = ObjectID(movieId);
    const allPosts = await this.getAllPosts();
    const postsforMovie = allPosts.filter(
      (post) => post.postMovieId === parsedId
    );
    return postsforMovie;
  },
  // The only things that can be edited about a post after creation are title, description, tags, and images
  // Also can edit repliesArray
  // Input is post id and an object of the updated params
  async editPost(postId, updatedParams) {
    const parsedId = ObjectID(postId);
    const post = await this.getPost(parsedId);
    const postCollection = await posts();
    if (updatedParams.title) {
      sProvided(updatedParams.title, "title");
      post.postTitle = updatedParams.title;
    }
    if (updatedParams.description) {
      sProvided(updatedParams.description, "description");
      post.postBody = updatedParams.postBody;
    }
    if (updatedParams.images) {
      aProvided(updatedParams.images, "Images");
      post.postImages = updatedParams.images;
    }
    if (updatedParams.tags) {
      aProvided(updatedParams.tags, "tags");
      post.postTags = updatedParams.tags;
    }
    if (updatedParams.postReplies) {
      aProvided(updatedParams.postReplies, "comments");
      post.postReplies = updatedParams.postReplies;
    }
    const updatedInfo = await postCollection.updateOne(
      { _id: parsedId },
      { $set: post }
    );
    const updatedPost = await this.getPost(parsedId);
    return updatedPost;
  },
  async removePost(postId) {
    const parsedId = ObjectID(postId);
    const post = await this.getPost(parsedId);
    const title = post.title;
    const postCollection = await posts();

    const deletionInfo = await postCollection.removeOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) {
      throw "Could not remove the post";
    }
    return `${title} has been successfully removed`;
  },
  async addComment(postId, commentId) {
    const parsedPostId = ObjectID(postId);
    const parsedCommentId = ObjectID(commentId);
    const post = await this.getPost(postId);
    post.postReplies += [parsedCommentId];
    return await this.editPost(parsedPostId, post);
  },
};
