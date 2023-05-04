const express = require('express');
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals.json');

// use port sent by heroku if provided, if not, use port 3001
const PORT = process.env.PORT || 3001;

// 1: instantiate the server
const app = express();

// 4. MIDDLEWARE: intercept incoming data and convert raw data to JSON object
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parese incoming JSON data
app.use(express.json());
// instruct server to make public folder readily available so it can be access by html pages
app.use(express.static('public'));

// filter results based on query strings
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array
        // If personalityTrait is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // check the trait against each animal in the filteredResults array
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id )[0];
    return result;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    // update our local copy of the animal data (animals)
    animalsArray.push(animal);

    // write new array to our json file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

// html routes
app.get('/', (req, res) => {
    // respond with html page to display in browser
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});


// API routes
// 3: create a route that the frontend can request data from 
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// req.query is multifaceted, often combining multiple parameters
// req.param is specific to a single property, often intended to retrieve a single record
// param route must come after the other get route
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        // send 404 if animal not found for that id
        res.send(404);
    }
});

// POST route represents action of client requesting the server to accept data (req.body is how we access that data)
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error bacl
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

// wildcard route to redirect user if an invalid route is entered (this should come after all other html routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// 2: chain listen() onto our server to make our server listen for requests
// this can go anywhere after the instatiation of our server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});