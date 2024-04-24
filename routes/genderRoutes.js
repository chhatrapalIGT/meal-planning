const express = require('express');
const genderController = require('../controllers/genderController');

const router = express.Router();
router.get('/men', genderController.gender);
router.post('/diet-plan', genderController.gender);

module.exports = router;


