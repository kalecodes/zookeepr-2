const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// use port sent by heroku if provided, if not, use port 3001
const PORT = process.env.PORT || 3001;

// 1: instantiate the server
// 'app' represents a single instance of the Express.js server
const app = express();

// 4. MIDDLEWARE: intercept incoming data and convert raw data to JSON object
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// instruct server to make public folder readily available so it can be access by html pages
app.use(express.static('public'));
// middleware for router - modularized api calls
// this first one will append '/api' to the front off all the routes in animalRoutes.js (why we removed those)
app.use('/api', apiRoutes);
// because this contains out wildcard endpoint, it must come after all other routes or it will block them
app.use('/', htmlRoutes);



// 2: chain listen() onto our server to make our server listen for requests
// this can go anywhere after the instatiation of our server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});