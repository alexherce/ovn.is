const db = require('../lib/mysql.js');
const validator = require('validator');
const shortid = require('shortid');

function abort(connection, reject, error) {
  connection.release();
  return reject(error);
}

exports.getFullUrl = function(params) {
  return new Promise((resolve, reject) => {
    if (!shortid.isValid(params.key)) return reject({success: false, error: 'invalid_url'});

    db.get(db.READ, function(err, connection) {
      if (err) {
        connection.release();
        return reject(err);
      }

      connection.query("SELECT url FROM links WHERE urlKey = ?", [params.key], function (error, result) {
        connection.release();
        if (error) return reject({success: false, error: 'query_error', details: error});

        if (result.length != 1) return reject({success: false, error: 'not_found'});
        return resolve({success: true, url: result[0].url});
      });
    });
  });
}
