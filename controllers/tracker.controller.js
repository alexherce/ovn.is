const tracker = require('../models/tracker.model');

exports.saveHit = function(req) {
  let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':').pop();
}
