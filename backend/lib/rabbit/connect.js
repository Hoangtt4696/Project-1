var amqp = require('amqplib/callback_api');
let arrayQueue = require('./config')
let Queue = require('./queue')
let path = require('path');
let _ = require('lodash');

let helperObjectArray = require(path.resolve('./helper/object-array.js'));
let logger = require(path.resolve('./helper/logger.js'));
const rabbit_config = global.config.rabbit_config;
var rabbitUrl = 'amqp://' + rabbit_config.user + ':' + rabbit_config.pass +
  '@' + rabbit_config.host + ':' + rabbit_config.port + '/' +
  rabbit_config.vhost;


module.exports = () => {
if (!global.rabbit_connect && rabbit_config.active) {
    amqp.connect(rabbitUrl, async function (err, conn) {
      if (err) {
        console.log(err);
        return false;
      } else {
        global.rabbit_connect = conn;

        for (let queue in arrayQueue) {
          try {
            if (rabbit_config.publisher_active) {
              let item = arrayQueue[queue];
              let limitConsomer = _.get(item, 'limitConsumer', 0);
              for (let i = 0; i < limitConsomer; i++) {
                await createPublish(conn, queue);
              }
            }
          } catch (error) {
            logger.error(error);
          }
        }
        console.log('connect rabbit success');
      }
    });
  }
  return global.rabbit_connect
}

function createPublish(conn, q) {
  return new Promise((resolve, reject) => {
    conn.createConfirmChannel(function (err, ch) {
      if (err) {
        console.log(err);
      } else {
        ch.assertQueue(q, { durable: true });
        ch.consume(q, function (msg) {
          callProcess(msg, q, ch);
        }, { noAck: false });
        resolve();
      }
    });
  })
 
}

async function callProcess(msg, q, ch) {
  let data = JSON.parse(msg.content.toString());
  let objItem = arrayQueue[q];
  let process = objItem.func;
  if (process) {
    let pass = false;
    try {
      await process(data);
      console.log('process success');
      pass = true;
    } catch (error) {
      logger.error(error);
    }

    if (!pass) {
      let retry = parseInt(data.retryTimes) + 1;
      data.retryTimes = retry;
      Queue(data, q);
    }
  }
  ch.ack(msg);
}