import * as _ from 'lodash';

export function handler(event: any, context: any, callback: any): void {
  console.log('> handler');
  console.log(`- event: ${JSON.stringify(event)}`);
  const request = JSON.parse(event.body);
  console.log(`- event.body: ${JSON.stringify(request)}`);

  const response: any = {};
  response.statusCode = 200;
  const responseBody = {};

  _.forIn(request, (value, key) => {
    console.log(`- key:${key}, value:${value}`);
    if (_.isString(value)) {
      _.set(responseBody, key, _.toUpper(value));
    } else {
      _.set(responseBody, key, value);
    }
  });

  response.body = JSON.stringify(responseBody);

  console.log(`- response: ${JSON.stringify(response)}`);
  console.log('< handler');
  callback(undefined, response);
}
