//Modules
var pkg             = require('./package.json');
var express         = require('express')
var app             = express()
var bodyParser      = require('body-parser')
var mongoose        = require('mongoose')
var config          = require('./lib/config')
var path            = require('path')
var chart           = require('chart.js')
var cookieParser    = require('cookie-parser')
var session         = require('express-session')
var helpers         = require('view-helpers')
var favicon 		= require('serve-favicon')
var passport        = require('passport')
var LocalStrategy   = require('passport-local').Strategy
var multer          = require('multer')

global.config = config;
// Service Port
var port = config.port;

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// MongoDB
mongoose.Promise = global.Promise
mongoose.connect(config.database, { useMongoClient: true })

mongoose.connection.on('connected', () => {
    return console.log('Mongoose conectado')
})

mongoose.connection.on('disconnected', () => {
    return console.log('Mongoose desconectado')
})

mongoose.connection.on('error', error => {
    return console.log('Mongoose erro de conexão: ' + error)
})

//Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Passport middleware Scope******************************************************************
app.use(session({
        secret: 'un1tyshadow', 
        saveUninitialized: false, 
        resave:false
        }))
app.use(passport.initialize())
app.use(passport.session())

// Configure passport-local to use account model for authentication
var  User = require('./models/User')
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//*********************************************************************************************
app.use(cookieParser())
//*********************************************************************************************
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})
//*********************************************************************************************  
app.use(helpers('dashboard'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Set Service Scope for Intercharge messages
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

// Set Main Route
app.use('/', require('./routes/routes'))


var notAuthorized = {
    flashType: 'error',
    message: 'Access Denied',
    redirect: '/errors/403',
    status: 403
};
 
var notAuthenticated = {
    flashType: 'error',
    message: 'User or password invalid',
    redirect: '/login'
};

app.set('permission', {
    role: 'userProfile',
    notAuthorized: notAuthorized,
    notAuthenticated: notAuthenticated 
});

// Set
app.listen(process.env.PORT || port, function () {
    console.log(pkg.name,`listening on http://localhost:${port}`)
})
