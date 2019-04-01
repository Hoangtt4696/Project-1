'use strict'
let knex = require('knex');
require('dotenv').config();

exports.getDB = () => {
  
  if (global.db_pg) {
    return global.db_pg;
  } else {
    let connect_data = {
      host: process.env.db_pg_host,
      user: process.env.db_pg_user,
      port: process.env.db_pg_port,
      password: process.env.db_pg_pass,
      database: process.env.db_pg_name
    }
    let db_pg = knex({
      client: 'pg',
      connection: connect_data
    });
    global.db_pg = db_pg;
    return db_pg;
  }
};