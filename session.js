const session = require('express-session');

const sessionConfig = {
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
};

module.exports = session(sessionConfig);
