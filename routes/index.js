const express = require('express');
const router = express.Router();

const linkController = require('../controllers/links.controller');

router.get('/:id', linkController.getFullUrl);
router.post('/api/create', linkController.create);

module.exports = router;
