const db = require('../lib/mysql.js');
const validator = require('validator');
const shortid = require('shortid');

function abort(connection, reject, error) {
  connection.release();
  return reject(error);
}

exports.create = function(params) {
  return new Promise((resolve, reject) => {

    let values = [];
    let today = moment();

    // generate short url
    values.push(shortid.generate());
    values.push(today);
    values.push(today.add(7, 'days'));

    if (params.url && !validator.isEmpty(params.url)) {
      if (!validator.isLength(params.url, {min: 4, max: 256})) return reject({success: false, error: 'invalid_length'});
      if (!validator.isURL(params.url)) return reject({success: false, error: 'invalid_url'});
      values.push(params.url);
    } else {
      return reject({success: false, error: 'missing_parameters'});
    }

    db.get(db.WRITE, function(err, connection) {
      if (err) {
        connection.release();
        return reject(err);
      }

      connection.query("INSERT INTO links (urlKey, createdDt, expirationDt, url) VALUES (?, ?, ?, ?)", values, function (error, result) {
        connection.release();
        if (error) return reject({success: false, error: 'save_error', details: error});
        if (!result) return reject({success: false, error: 'save_error'});
        return resolve({success: true, url: values[0]});
      });
    });
  });
}

exports.getFullUrl = function(params) {
  return new Promise((resolve, reject) => {
    if (!shortid.isValid(params.key)) return reject({success: false, error: 'invalid_url'});

    db.get(db.READ, function(err, connection) {
      if (err) {
        connection.release();
        return reject(err);
      }

      connection.query("SELECT * FROM links WHERE urlKey = ?", [params.key], function (error, result) {
        connection.release();
        if (error) return reject({success: false, error: 'query_error', details: error});

        if (result.length != 1) return reject({success: false, error: 'not_found'});
        return resolve({success: true, url: result[0].url});
      });
    });
  });
}
