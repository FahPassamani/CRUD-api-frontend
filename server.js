if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const morgan = require('morgan')
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const bodyparser = require("body-parser")
const path = require("path")

const connectDB = require('./server/database/connection')
const controller = require('./server/controller/controller')
const axios = require("axios")

app.set('view engine', 'ejs')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

const users = []
//const listaClientes = []

app.use(morgan('tiny'))
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
app.use(bodyparser.urlencoded({extended: true}))

connectDB();

//app.set("views", path.resolve(__dirname, "views/ejs"))

//Login
app.post("/login", checkNotAuthenticated, passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

//Register
app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            nome: req.body.nome,
            login: req.body.login,
            email: req.body.email,
            password: hashedPassword //req.body.senha
        })
        console.log(users);
        res.redirect("/login")
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

app.post('/api/users', controller.create)
app.get('/api/users', controller.find)
app.put('/api/users/:id', controller.update)
app.delete('/api/users/:id', controller.delete)

//Endpoint
app.get('/', checkAuthenticated, (req, res) => {
    res.render("index.ejs")
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})

app.get('/api', checkAuthenticated, (req, res) => {
    axios.get('http://localhost:3000/api/users').then(function(response){
        res.render("api.ejs",{users:response.data});
    }).catch(err =>{
        res.send(err);
    })
})

app.get('/add-user', checkAuthenticated, (req, res) => {
    res.render("addUser.ejs")
})

app.get('/update-user', checkAuthenticated, (req, res) => {
    axios.get('http://localhost:3000/api/users', {params: { id: req.query.id}}).then(function(userdata){
        res.render("updateUser", {user: userdata.data})
    }).catch(err => {
        res.send(err)
    })
})

//Function
function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}

app.delete('/logout', (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect("/")
    } else {
        next()
    }
}
app.listen(PORT, () => console.log(`Server is running at port: ${PORT}`))