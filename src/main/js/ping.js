exports.handler = (event, context, callback) => {
  console.log("> handler");
  console.log("< handler");
  callback(null, "pong");
};
