const data = require("../data");
const ObjectID = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
module.exports = {
  async createUser(firstName, lastName, username, email, password) {
    if (!firstName && typeof firstName != "string") {
      throw "Invalid First Name";
    }
    if (!lastName && typeof lastName != "string") {
      throw "Invalid last Name";
    }
    const userCollection = await users();
    if (!username && typeof username != "string") {
      throw "Invalid UserName";
    }
    if (await userCollection.findOne({ username: username })) {
      throw "username is already taken";
    }
    if (!email && emailIsValid(email)) {
      throw "Invalid First Name";
    }
    if (!password && typeof password != "string") {
      throw "Invalid password";
    }
    const hashedPass = await bcrypt.hash(password, 16);
    let user = {
      _id: ObjectID(),
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPass,
      postsArray: [],
      moviesRated: {}
    };
    const insertInfo = await userCollection.insertOne(user);
    if (insertInfo.insertedCount === 0) {
      throw "Could not enter user information";
    }
    return user;
  },
  async getUserByID(id) {
    var oID = ObjectID(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: oID });
    if (!user) {
      throw "no user exists with that id";
    }
    return user;
  },
  async getUsersAll() {
    const userCollection = await users();
    const allUsers = await userCollection.find({}).toArray();
    return allUsers;
  },
};
