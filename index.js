const express = require('express');
const app = express();



const path = require('path');
const handlebars=require('express-handlebars');
const methodOverride = require('method-override');
const session=require('express-session');
const MongoDBSession=require('connect-mongodb-session')(session);

const dotenv=require('dotenv').config();

const route=require('./routes/index');
const db=require('./config/db');

const port=process.env.PORT || 5000;


// temple engine
app.engine('hbs', handlebars({
  extname:'.hbs',
  helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


// override method
app.use(methodOverride('_method'));
// static files
app.use(express.static(path.join(__dirname, 'public')));
//convert to json
app.use(express.urlencoded( {extended: true }));
app.use(express.json());

// connect to database
db.connect();

const store=new MongoDBSession({
    uri: 'mongodb+srv://manhhoach:8KrDs2Zw3NKXHFM1@cluster0.um9te.mongodb.net/eeec-club?retryWrites=true&w=majority',   
    collection: 'sessions'
});

app.use(
  session({
    secret:'secret',
    resave:false,
    store:store,
    saveUninitialized:false
  })
);


// route init
route(app);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
    
})