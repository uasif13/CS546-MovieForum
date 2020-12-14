const { ObjectID } = require("mongodb");
const dbConnection = require("../config/mongoConnection");
const dataMethods = require("../data/index");
// Create variables for each file
const userData = dataMethods.users;
const postsData = dataMethods.posts;
const moviesData = dataMethods.movies;
async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  try {
    const bob = await userData.createUser(
      "BOb",
      "Smith",
      "fda",
      "bobsmith@gmail.com",
      "hello123"
    );
    const mulan = await moviesData.createMovie(
      "Mulan",
      "this is the description for Mulan",
      ["Romance"],
      "2,000,000"
    );
    const fatman = await moviesData.createMovie(
      "fatman",
      "this is the description for fatman",
      ["Comedy"],
      "1,000,000"
    );
    await postsData.createPost(
      fatman,
      bob,
      "first post!",
      "description",
      [],
      []
    );
    await postsData.createPost(
      mulan,
      bob,
      "Second post!",
      "description",
      [],
      []
    );
  } catch (e) {
    console.log(e);
  }
  console.log("Done seeding database");
  await db.serverConfig.close();
}
main().catch((error) => {
  console.log(error);
});
