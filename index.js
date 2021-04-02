//Set up
const express = require('express')
const morgan = require('morgan')
const path = require('path')
//--Session setup
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const session = require('express-session')
const PORT = 3000
const app = express()
app.set('view engine', 'ejs')
//--Routes setup
const loginRouter = require('./routes/login')

app.use(morgan('dev'))
app.use('/static', express.static(path.join(__dirname, 'public')))
//--Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}))
//--Parse JSON bodies (as sent by API clients)
app.use(express.json());
//--initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
//--initialize cookie-parser to allow us access the cookies stored in the browser
//app.use(cookieParser());
//--initialize express-session to allow tracking the logged-in user across sessions
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "todo_secret"
}));

// Routes
app.use('/', loginRouter)
app.use('/login', loginRouter)

app.listen(PORT, () => {
    console.log(`server is listening on localhost:${PORT}!\n`)
})