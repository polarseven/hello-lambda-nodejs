const _ = require('lodash');
const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  console.log("> handler");

  var response = {};
  var s3 = new AWS.S3();

  var params = {};
  s3.listBuckets(params, (err, data) => {
    if (err) {
      console.error(err);
      console.log("< handler");
      callback(err, response);
    } else {
      console.log(`- S3 raw response: ${JSON.stringify(data)}`);
      if (data.Buckets) {
        response.bucketNames = _.map(data.Buckets, 'Name');
      }
      console.log(`- response: ${JSON.stringify(response)}`);
      console.log("< handler");
      callback(null, response);
    }
  });

};
