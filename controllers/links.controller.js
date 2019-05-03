const links = require('../models/links.model');

exports.getUrl = function(req, res, next) {
  if (!req.params.id) return res.status(400).send({success: false, error: 'missing_parameters'});

  links.getFullUrl({key: req.params.id})
  .then(result => {
    return res.redirect(301, result.url);
  })
  .catch(error => {
    if (error.error == 'not_found') return res.redirect('/x/not-found');
    return res.redirect('/x/error');
  });
}
