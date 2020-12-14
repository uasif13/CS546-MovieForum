const { ObjectID } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const postMethods = mongoCollections.posts;
const userMethods = mongoCollections.users;

module.exports = {

  async createComment(body, postId, userId) {
    try {
      await userMethods.getUserByID(ObjectID(userId));
    } catch (e) {
      throw e;
    }
    try {
      await postMethods.getPost(ObjectID(postId));
    } catch (e) {
      throw e;
    }

    let newComment = {
      body: body,
      repliedBy: userId ,
      repliedToPost: postId,
    };

    const commentCollection = await comments();
    const insertInfo = commentCollection.insertOne(newComment);
    
    if (insertInfo.inserted === 0) {
      throw "Comment not inserted";
    }
    const commentID = insertInfo.insertedId;
    await postMethods.addComment(post._id, commentID);
  },
    
  async getAllComments(postId){
        const parsedId = ObjectID(postId)
        const commentCollection = await comments()
        
        let commentList = await commentCollection.find({repliedToPost:parsedId}).toArray()
        return commentList
    },
  
  async deleteComment(commentID){
    const parsedId = ObjectID(commentID)
    const commentCollection = await comments()
    const deletedInfo = await commentCollection.removeOne({_id: parsedId})
    if (deletedInfo === 0){
        throw "Comment could not be removed"
    }
    // need to call fucntion to update post replies to empty array
    return "Comment deleted"
  },
 
  async deleteAllCommentsOfPost(postId){
      let post = await postMethods.getPost(postId);
      let commentsList = post.postReplies
      
      commentsList.forEach(id => {
          await deleteComment(id)
      });
      // need to call a function to update post replies to empty array
  },

  async editComment(commentId, newBody){
      const parsedId = ObjectID(commentID)
      let newComment = {
          body: newBody
      }
      const commentCollection = await comments()
      const updatedComment = await commentCollection.updateOne({_id: parsedId}, {$set : newComment})
      if(updatedComment.modifiedCount === 0){
          throw "Could not update comment"
      }
  }
};
