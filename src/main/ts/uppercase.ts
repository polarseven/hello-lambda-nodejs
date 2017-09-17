import * as _ from 'lodash';

export function handler(event: any, context: any, callback: any): void {
  console.log('> handler');

  const response = {};

  _.forIn(event, (value, key) => {
    console.log(`- key:${key}, value:${value}`);
    if (_.isString(value)) {
      _.set(response, key, _.toUpper(value));
    } else {
      _.set(response, key, value);
    }
  });


  console.log('< handler');
  callback(undefined, response);
}
