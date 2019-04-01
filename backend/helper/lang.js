/**
 * @author Tran Dinh Hoang
 * @module lang
 */

'use strict';

module.exports = {
  to                : to,
  toMap             : toMap,
  toResolve         : toResolve,
  setTimeoutPromise : setTimeoutPromise,
  PromiseAllStep    : PromiseAllStep
};

/**
 * change the way handle promise
 * @param {Object} promise 
 * @example
 * To handle mongoose error, instead of try catch :
 * try {
 *  let store = await StoresModel.findOne({ id : 1000 });
 * }
 * catch (err) {
 *   // handle mongoose error
 * }
 * You can :
 * let [err, store] = await to(StoresModel.findOne({ id : 1000 }));
 * if (err) {
 *  // handle mongoose error
 * }
 */
function to(promise) {
  return promise.then(data => {
     return [null, data]
  })
  .catch(err => [err]);
}

/**
 * Wrap a callback-based-API with a promise that only resolve all callback arguments, 
 * and doesn't reject anything
 * @param {function} callbackBasedAPI - The function that you want to wrap
 * @return {promise} Promisified API
 * @example 
 * 
 * // assume you have an function
 * function callbackBasedAPI(a1, a2, ..., aN, callback) {
 *    // do something ...
 *    callback(err, res1, res2, ..., resN);
 * }
 * 
 * // and want to receive all callback argument in one call through async/await, like :
 * let [err, res1, res2, ..., resN] = await callbackBasedAPI(a1, a2, ..., aN);
 * 
 * // so can easily handle error :
 * if (err) {
 *    handleError(err);
 * }
 * 
 * // just wrap it with before use
 * let callbackBasedAPI = toResolve(callbackBasedAPI);
 */
function toResolve(callbackBasedAPI) {
  return function(...f_args) {
    let $this = this;
    return new Promise((resolve) => {
      function callback(...args) {
        return resolve(args);
      }
      f_args.push(callback);
      callbackBasedAPI.apply($this, f_args);
    });
  }
}

function toMap(arr, key) {
  let res = new Map;
  if (Array.isArray(arr)) {
    arr.forEach(elem => {
      res.set(elem[key], elem);
    });
  }
  return res;
}

function setTimeoutPromise(callback, timeout, thisArg, ...args) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let result = undefined;
      if (typeof callback === 'function') {
        result = callback.apply(thisArg, args);
      }
      resolve(result);
    }, timeout);
  });
}

/**
 * Applies the function iteratee to each item in coll after timeout, which's increased by step
 * @param {array}     coll      A collection to iterate over
 * @param {function}  iteratee  An async function to apply to each item in coll. Apply with (thisArg, item, index)
 * @param {number}    step      Amount of milisecond that timeout increase after each item
 * @param {object}    thisArg   The this pointer of iteratee
 */
function PromiseAllStep(coll, iteratee, step, thisArg) {
  return new Promise((resolve, reject) => {
    Promise
      .all(coll.map((item, index) => {
        return setTimeoutPromise(iteratee, step * index, thisArg, item, index);
      }, thisArg))
      .then(resolved_items => resolve(resolved_items))
      .catch(rejected_items => reject(rejected_items));
  });
}