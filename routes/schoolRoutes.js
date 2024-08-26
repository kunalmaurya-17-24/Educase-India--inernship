const express = require('express');
const { addSchoolHandler, listSchoolsHandler } = require('../controllers/schoolController');

const router = express.Router();

router.post('/addSchool', addSchoolHandler);
router.get('/listSchools', listSchoolsHandler);

module.exports = router;
