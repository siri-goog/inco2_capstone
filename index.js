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
const signupRouter = require('./routes/signup')
const logoutRouter = require('./routes/logout')
const resetPwdRouter = require('./routes/resetPassword')
const newPwdRouter = require('./routes/newPassword')

//Google API Authentication
require('dotenv').config()
require('./passport-setup');
const passport = require('passport');
const cookieSession = require('cookie-session')
const isLoggedIn = require("./routes/middleware/isLoggedIn")
// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))
// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs')
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
    secret: "It's a secret!"
}));

// Routes
app.use('/', loginRouter)
app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/resetPassword', resetPwdRouter)
app.use('/newPassword', newPwdRouter)
app.use('/logout', logoutRouter)

//Social Media Authentication
app.get('/good', isLoggedIn, (req, res) =>{
    res.render("pages/profile",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
})
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.listen(PORT, () => {
    console.log(`server is listening on localhost:${PORT}!\n`)
})