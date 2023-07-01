const express = require('express');
const app = express();



const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

require('dotenv').config();

const routes = require('./routes/index');
const { connect } = require('./config');

const port = process.env.PORT || 5000;



app.engine('hbs', handlebars({
  extname: '.hbs',   helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));



app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


connect();

const store = new MongoDBSession({
  uri: process.env.DATABASE,
  collection: 'sessions'
});

app.use(
  session({
    secret: 'secret',
    resave: false,
    store: store,
    saveUninitialized: false
  })
);


routes(app);

app.listen(port, () => {
  console.log(`server listion on port ${port}`);

})