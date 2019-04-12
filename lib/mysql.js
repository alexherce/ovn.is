const mysql = require('mysql');

// MySQL setup for multiple database connections
exports.MODE_PRODUCTION = 'mode_production';

var state = {
  pool: null,
  mode: null,
};

// Database settings
const PRODUCTION_DB = process.env.PRODUCTION_DB;

exports.connect = function(mode, done) {
  if (mode === exports.MODE_PRODUCTION) {
    state.pool = mysql.createPoolCluster();

    state.pool.add('WRITE', {
      host: process.env.DB_HOST,
      user: process.env.DB_WRITE_1_USR,
      password: process.env.DB_WRITE_1_PWD,
      database: PRODUCTION_DB
    });

    state.pool.add('READ1', {
      host: process.env.DB_HOST,
      user: process.env.DB_READ_1_USR,
      password: process.env.DB_READ_1_PWD,
      database: PRODUCTION_DB
    });
  }

  state.mode = mode;
  done();
}

exports.READ = 'read';
exports.WRITE = 'write';

// Do not change this functions
exports.get = function(type, done) {
  var pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  if (type === exports.WRITE) {
    state.pool.getConnection('WRITE', function (err, connection) {
      if (err) return done(err);
      done(null, connection);
    });
  } else {
    state.pool.getConnection('READ*', function (err, connection) {
      if (err) return done(err);
      done(null, connection);
    });
  }
}
