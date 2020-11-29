const mainRoutes = require('./main')
// Insert separate routes for the different functions

const constructor = (app) => {
    // Add routes with app.use
    app.use("/", mainRoutes)
    app.use("*", (req,res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructor;