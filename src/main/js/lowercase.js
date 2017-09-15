const _ = require('lodash');

exports.handler = (event, context, callback) => {
  console.log("> handler");

  var response = {};

  _.forIn(event, (value, key) => {
    console.log(`- key:${key}, value:${value}`);
    if (_.isString(value)) {
      _.set(response, key, _.toLower(value));
    } else {
      _.set(response, key, value);
    }
  })

  console.log("< handler");
  callback(null, response);
};
