const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const postMethods = require("./posts");
const userMethods = require("./users");

function checkString(str) {
  if (str === null || str.match(/^\s*$/) !== null) {
    throw "Comment is empty";
  }
}

function removeArrayElement(arr, commentID) {
  var index = arr.indexOf(commentID);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function aProvided(param, paramName) {
  console.log(Array.isArray(param));
  if (!Array.isArray(param)) {
    throw `Invalid post ${paramName} since ${paramName} is not an array`;
  }
}

module.exports = {
  async createComment(body, postId, userId) {
    let user = {};
    try {
      user = await userMethods.getUserByID(userId);
    } catch (e) {
      throw e;
    }
    try {
      await postMethods.getPost(postId);
    } catch (e) {
      throw e;
    }
    try {
      checkString(body);
    } catch (e) {
      throw e;
    }

    let newComment = {
      body: body,
      repliedBy: userId,
      userName: user.username,
      repliedToPost: postId,
    };

    const commentCollection = await comments();
    const insertInfo = commentCollection.insertOne(newComment);

    if (insertInfo.inserted === 0) {
      throw "Comment not inserted";
    }
    const commentID = insertInfo.insertedId;
    await postMethods.addComment(postId, commentID);
  },

  async getAllComments(postId) {
    const commentCollection = await comments();
    let commentList = await commentCollection
      .find({ repliedToPost: postId })
      .toArray();

    return commentList;
  },

  async deleteComment(postID, commentID) {
    const parsedId = ObjectID(commentID);
    const commentCollection = await comments();
    const deletedInfo = await commentCollection.removeOne({ _id: parsedId });
    if (deletedInfo === 0) {
      throw "Comment could not be removed";
    }
    let parentPost = await postMethods.getPost(postID);
    let repliesList = parentPost.postReplies;
    await postMethods.editPost(postID, {
      postReplies: removeArrayElement(repliesList, commentID),
    });
    return "Comment deleted";
  },

  async deleteAllCommentsOfPost(postID) {
    //console.log("inside datacomments");

    const commentCollection = await comments();
    //console.log(commentsList);

    const deletedInfo = await commentCollection.deleteMany({
      repliedToPost: postID,
    });
    if (deletedInfo === 0) {
      throw "Comment could not be removed";
    }
    // return "nothing to delete";
  },

  async editComment(commentId, newBody) {
    const parsedId = ObjectID(commentId);
    let newComment = {
      body: newBody,
    };
    const commentCollection = await comments();
    const updatedComment = await commentCollection.updateOne(
      { _id: parsedId },
      { $set: newComment }
    );
    if (updatedComment.modifiedCount === 0) {
      throw "Could not update comment";
    }
  },
};
