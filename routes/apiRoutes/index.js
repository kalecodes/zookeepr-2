const router = require('express').Router();
const animalRoutes = require('./animalRoutes');
const zookeeperRoutes = require('./zookeeperRoutes');

// middleware
router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;