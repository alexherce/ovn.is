const express = require('express');
const router = express.Router();

router.get('/:id', function(req, res, next) {
  res.status(200).send({success: true, id: req.params.id});
});

module.exports = router;
