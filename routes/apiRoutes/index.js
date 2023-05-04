const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// middleware
router.use(animalRoutes);

module.exports = router;