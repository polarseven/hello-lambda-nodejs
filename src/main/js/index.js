'use strict';

const AWS = require('aws-sdk');
const _ = require('lodash');
const uuid = require('uuid/v4');

const ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
});

const greetingTable = process.env.TABLE_NAME;
const greetingValueGsi = process.env.GSI_VALUE_NAME;

const mapGreetingFromItem = (item) => {

  return {
    id: _.get(item, 'id.S', ''),
    language: _.get(item, 'language.S', ''),
    value: _.get(item, 'value.S', '')
  }
};

const createResponse = (statusCode, body) => {

  return {
    statusCode: statusCode,
    body: body
  }
};

exports.create = (event, context, callback) => {
  console.log(`> create`);

  let greeting = JSON.parse(event.body);
  greeting.id = uuid();

  let params = {
    TableName: greetingTable,
    Item: {
      language: {
        S: greeting.language
      },
      value: {
        S: greeting.value
      },
      id: {
        S: greeting.id
      }
    },
    ConditionExpression: 'attribute_not_exists(id)'
  };

  let putItem = (params) => {
    return ddb.putItem(params).promise();
  };

  putItem(params).then((data) => {
    console.log(`- data: ${JSON.stringify(data)}`);
    console.log(`< create`);
    callback(null, createResponse(200, JSON.stringify(greeting)));
  }).catch((err) => {
    console.log(`PutItem failed for event: ${JSON.stringify(event)} with error: ${err}`);
    console.log(`< create`);
    callback(null, createResponse(500, err));
  });

};

exports.findAll = (event, context, callback) => {
  console.log(`> findAll`);

  let params = {
    TableName: greetingTable,
    Limit: 1000
  };

  let scan = (params) => {
    return ddb.scan(params).promise();
  };

  scan(params).then((data) => {
    console.log(`- data: ${JSON.stringify(data)}`);
    if (data.Count === 0) {
      console.log(`< findAll`);
      callback(null, createResponse(200, []));
    } else {
      let greetings = [];
      for (let item of data.Items) {
        greetings.push(mapGreetingFromItem(item));
      }
      console.log(`< findAll`);
      callback(null, createResponse(200, JSON.stringify(greetings)));
    }
  }).catch((err) => {
    console.log(`Scan failed for event: ${JSON.stringify(event)} with error: ${err}`);
    console.log(`< findAll`);
    callback(null, createResponse(500, err));
  });

};

exports.findById = (event, context, callback) => {
  console.log(`> findById`);

  let params = {
    TableName: greetingTable,
    Key: {
      id: {
        S: event.pathParameters.greetingId
      }
    }
  };

  let getItem = (params) => {
    return ddb.getItem(params).promise();
  };

  getItem(params).then((data) => {
    console.log(`- data: ${JSON.stringify(data)}`);
    console.log(`< findById`);
    if (data.Item) {
      callback(null, createResponse(200, JSON.stringify(mapGreetingFromItem(data.Item))));
    } else {
      callback(null, createResponse(404, null));
    }
  }).catch((err) => {
    console.log(`GetItem failed for event: ${JSON.stringify(event)} with error: ${err}`);
    console.log(`< findById`);
    callback(null, createResponse(500, err));
  });

};

exports.update = (event, context, callback) => {
  console.log(`> update`);

  let greeting = JSON.parse(event.body);

  let params = {
    TableName: greetingTable,
    ExpressionAttributeNames: {
      '#language': 'language',
      '#value': 'value'
    },
    ExpressionAttributeValues: {
      ':language': {
        S: greeting.language
      },
      ':value': {
        S: greeting.value
      }
    },
    Key: {
      id: {
        S: greeting.id
      }
    },
    UpdateExpression: 'SET #language = :language, #value = :value'
  };

  let updateItem = (params) => {
    return ddb.updateItem(params).promise();
  };

  updateItem(params).then((data) => {
    console.log(`- data: ${JSON.stringify(data)}`);
    console.log(`< update`);
    callback(null, createResponse(204, null));
  }).catch((err) => {
    console.log(`UpdateItem failed for event: ${JSON.stringify(event)} with error: ${err}`);
    console.log(`< update`);
    callback(null, createResponse(500, err));
  });

};

exports.delete = (event, context, callback) => {
  console.log(`> delete`);

  let requestBody = JSON.parse(event.body);

  let params = {
    TableName: greetingTable,
    Key: {
      id: {
        S: requestBody.id
      }
    }
  };

  let deleteItem = (params) => {
    return ddb.deleteItem(params).promise();
  };

  deleteItem(params).then((data) => {
    console.log(`- data: ${JSON.stringify(data)}`);
    console.log(`< delete`);
    callback(null, createResponse(204, null));
  }).catch((err) => {
    console.log(`DeleteItem failed for event: ${JSON.stringify(event)} with error: ${err}`);
    console.log(`< delete`);
    callback(null, createResponse(500, err));
  });

};
