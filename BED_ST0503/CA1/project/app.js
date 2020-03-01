// Setting up express and app
const express = require('express');
const app = express();

// Setting up handlebars, for the views
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        section(name, options){
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Setting up body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setting up cookie parser
const cookieParser = require('cookie-parser');
const COOKIE_SECRET = process.env.COOKIE_SECRET;
app.use(cookieParser(COOKIE_SECRET));

// Setting up middlewares
const middlewares = require('./middlewares/index');
middlewares.init(app);

// Setting up controllers
const controllers = require('./controllers/index');
controllers.init(app);

// Setting up ports
const PORT  = 3000;
app.listen(PORT, function(){
    console.log(`Server listening at port ${PORT}`);
});