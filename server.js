const path = require('path');
const express = require('express');
const session = require('express-session');
const expresshbs = require('express-handlebars');
const sequelize = require('./config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// ? helpers?

const app = express();
// port 3001 if process.env.port fails
const PORT = process.env.port || 3001;

const userSession = {
    secret: 'Super secret secret',
    // timeout after 30 seconds of idle
    cokkie: {
        maxAge: 300000,
        httpOnly: true, 
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({ db: sequelize})
};

app.use(session(userSession));

// ? app.engine and app.set

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use(require('./controllers/'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
    sequelize.sync({force:false});
});