const express = require('express');
const router = express.Router();

const linkController = require('../controllers/links.controller');

router.get('/:id', linkController.getUrl);

module.exports = router;
