const dbConnection = require('../config/mongoConnection');
const dataMethods = require('../data/index');
// Create variables for each file

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    // Insert seed functions for database

    console.log('Done seeding database')
    await db.serverConfig.close()
};

main().catch(error => {
    console.log(error);
});
