const express = require('express');
const app = express();
const expressHbs = require('express-handlebars');
const path = require("path");
const session = require('express-session')
const passport = require('passport')


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/";


const shopRouter = require('./routes/shop')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
// const productsdbRouter = require('./routes/productsdb')
// const seederRouter = require('./routes/seeder.js');

app.engine('.hbs', expressHbs.engine({defaultLayout: 'layout', extname: '.hbs'}));
app.set("view engine", "hbs");

app.use(session({secret: 'supersecret', resave: true, saveUninitialized: true}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use(express.static(path.join(__dirname, '/public')));

//app.use('/mongo/seed', seederRouter); //Wypełnia baze danych podanymi danymi
app.use('/', shopRouter) // Pokazuje strone z shop/index.hbs
app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.listen(3000);