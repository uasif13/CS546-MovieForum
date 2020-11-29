const express = require('express')
const app = express();
const static = express.static(__dirname + '/public')
const session = require('express-session')
const configRoutes = require('./routes')
const exphbs = require('express-handlebars')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
    session({
        name: 'AuthCookie',
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
    })
)
// Insert middleware functions
app.use('/public', static);
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
configRoutes(app)

app.listen(3000, () => {
    console.log("we've got a server running")
    console.log("Your routes will be running on http://localhost:3000")
})