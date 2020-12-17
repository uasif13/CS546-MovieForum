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
    console.log(Array.isArray(param))
  if (!Array.isArray(param)) {
    throw `Invalid post ${paramName} since ${paramName} is not an array`;
  }
}

async function errorHandlingCreatePost(
  movieId,
  userId,
  title,
  description,
  tags,
  image
) {
  try {
    await movieMethods.getMovie(ObjectID(movieId));
  } catch (e) {
    throw e;
  }
  try {
    await userMethods.getUserByID(ObjectID(userId));
  } catch (e) {
    throw e;
  }
  sProvided(title, "title");
  sProvided(description, "description");
  aProvided(tags, "Tags");
  sProvided(image, "image");
}
module.exports = {
  async createPost(
    movieId,
    userId,
    title,
    description,
    tags,
    image = "no_image.jpg"
  ) {
    errorHandlingCreatePost(movieId, userId, title, description, tags, image);
    let post = {
      postTitle: title,
      postBody: description,
      postMovieId: movieId,
      postReplies: [],
      postLikes: 0,
      postDislikes: 0,
      postuserId: userId,
      postTags: tags,
      postImage: `../../public/assets/${image}`,
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
      throw "Could not find a post with the given id";
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
    const parsed = await movieMethods.getMovie(parsedId);
    const allPosts = await this.getAllPosts();
    const postsforMovie = allPosts.filter((post) =>
      post.postMovieId.equals(parsed._id)
    );
    return postsforMovie;
  },
  async getPostforUser(userId) {
    const parsedId = ObjectID(userId);
    const parsed = await userMethods.getMovie(parsedId);
    const allPosts = await this.getAllPosts();
    const postsforMovie = allPosts.filter(
      (post) => post.postuserId === parsed._id
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
    if (updatedParams.image) {
      sProvided(updatedParams.image, "Images");
      post.postImages = updatedParams.image;
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
    post.postReplies.push(parsedCommentId);
    return await this.editPost(parsedPostId, post);
  },
};
