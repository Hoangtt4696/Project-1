let chalk = require('chalk');
var mongoose = require('mongoose');
(function() {
  if (global.db_mg) {
    return global.db_pg;
  } else {
    //Thiết lập kết nối tới Mongoose
    let mongoDB = `mongodb://${global.config.mongo_config.db_mg_host}:${global.config.mongo_config.db_mg_port}/${global.config.mongo_config.db_mg_name}`;
    if (global.config.db_mg_connect_string) {
      mongoDB = global.config.db_mg_connect_string;
    }
    mongoose.connect(mongoDB, {
      poolSize: 10,
      keepAlive: 1,
      autoReconnect: true,
      user: global.config.mongo_config.db_mg_user,
      pass: global.config.mongo_config.db_mg_pass
    });
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.on('open', () => {
      console.log(chalk.blue('Connect Mongo success'));
    });
    global.db_mg = db;
    return global.db_mg;
  }
})();

