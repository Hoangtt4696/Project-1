let path = require('path');
let _ = require('lodash');
let arrayQueue = require('./config')
let logger = require(path.resolve('./helper/logger.js'));
const rabbit_config = _.get(global, 'config.rabbit_config', {});

function sentData(dataSend, queueName) {
  let conn = global.rabbit_connect;
  return new Promise((resolve, reject) => {
    if (conn) {
      if (arrayQueue[queueName]) {
        conn.createChannel(function (err, ch) {
          if (err) {
            reject(err);
          } else {
            ch.assertQueue(queueName, { durable: true });
            ch.sendToQueue(queueName, new Buffer(JSON.stringify(dataSend)));
            resolve(true)
          }
        });
      } else {
        reject(`queue : ${queueName} not setting run on app`);
      }
    } else {
      reject('Rabbit connect not ready');
    }
  })
}

module.exports = async (dataSend, queue) => {
  let active = _.get(arrayQueue, `${queue}.active`, false);
  if (active) {
    if (!dataSend.retryTimes) {
      dataSend.retryTimes = 0;
    }
  
    try {
      let defaultData = arrayQueue[queue];
      if (dataSend.retryTimes < defaultData.retryLimit) {
        setTimeout(async () => {
          await sentData(dataSend, queue);
        }, dataSend.retryTimes === 0 ? 100 : rabbit_config.time_retry_consumer);
      }
    } catch (error) {
      logger.error(error);
    }
  }
  
}

