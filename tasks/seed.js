const dbConnection = require("../config/mongoConnection");
const dataMethods = require("../data/index");
// Create variables for each file
const userData = dataMethods.users;
async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  try {
    await userData.createUser(
      "BOb",
      "Smith",
      "fda",
      "bobsmith@gmail.com",
      "hello123"
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
