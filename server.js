const express = require('express');
const cors = require('cors');
const session = require('./session');
const signupRoutes = require('./signup');
const signinRoutes = require('./signin');
const homeRoutes = require('./home');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(session);

app.use(signupRoutes);
app.use(signinRoutes);
app.use(homeRoutes);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});