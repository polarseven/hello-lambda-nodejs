const _ = require('lodash');

isNullOrEmpty = (str) => {
  return _.isNull(str) || _.isUndefined(str) || _.isEmpty(str)
}

exports.handler = (event, context, callback) => {
  console.log("> handler");
  console.log(`- name:${event.name}`);

  const defaultText = "Hello World!";
  var response = {};

  if (isNullOrEmpty(event.name)) {
    response.text = defaultText;
  } else {
    response.text = `Hello ${event.name}!`;
  }

  console.log("< handler");
  callback(null, response);
};
