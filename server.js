const express = require('express');
const { animals } = require('./data/animals.json');

// use port sent by heroku if provided, if not, use port 3001
const PORT = process.env.PORT || 3001;

// 1: instantiate the server
const app = express();

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

// 2: chain listen() onto our server to make our server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});