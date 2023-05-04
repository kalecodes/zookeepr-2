// router allows us to declare routes in any file (as long as you use the proper middleware)
const router = require('express').Router();
const { animals } = require('../../data/animals');
const { filterByQuery, findById, validateAnimal, createNewAnimal } = require('../../lib/animals');



// API routes
// 3: create a route that the frontend can request data from 
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// req.query is multifaceted, often combining multiple parameters
// req.param is specific to a single property, often intended to retrieve a single record
// param route must come after the other get route
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        // send 404 if animal not found for that id
        res.send(404);
    }
});

// POST route represents action of client requesting the server to accept data (req.body is how we access that data)
router.post('/animals', (req, res) => {
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

module.exports = router;