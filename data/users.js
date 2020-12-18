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
      moviesRated: {},
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
  async updateUser(id, newfirstname, newlastname, newusername, newemail) {
    if (!id) {
      throw "You must provide an ID";
    }
    if (!newfirstName && typeof newfirstName != "string") {
      throw "Invalid First Name";
    }
    if (!newlastName && typeof newlastName != "string") {
      throw "Invalid last Name";
    }
    const userCollection = await users();
    if (!newusername && typeof newusername != "string") {
      throw "Invalid UserName";
    }
    if (await userCollection.findOne({ newusername: newusername })) {
      throw "username is already taken";
    }
    if (!newemail && emailIsValid(newemail)) {
      throw "Invalid First Name";
    }

    const updateUser = {
      firstName: newfirstname,
      lastName: newlastname,
      userName: newusername,
      email: newemail,
    };
    const updatedInfo = await userCollection.updateOne(
      { _id: ObjectID(id) },
      { $set: updateUser }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw `Could not update user`;
    } else {
      return await this.getUserByID(id);
    }
  },
};
