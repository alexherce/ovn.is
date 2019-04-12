const links = require('../models/links.model');

exports.create = function(req, res, next) {
  if (!req.body.url) return res.status(400).send({success: false, error: 'missing_parameters'});

  links.create({url: req.body.url})
  .then(result => {
    return res.status(201).send({success: true, url: result.url});
  })
  .catch(error => {
    return res.status(400).send({success: false, error: error.error, details: error.details});
  })
}

exports.getFullUrl = function(req, res, next) {
  if (!req.params.id) return res.status(400).send({success: false, error: 'missing_parameters'});

  links.getFullUrl({key: req.params.id})
  .then(result => {
    return res.redirect(result.url);
  })
  .catch(error => {
    return res.status(400).send({success: false, error: error.error, details: error.details});
  })
}
