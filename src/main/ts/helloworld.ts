import * as _ from 'lodash';

function isNullOrEmpty(str: string) {
  return _.isNull(str) || _.isUndefined(str) || _.isEmpty(str);
}

export function handler(event: any, context: any, callback: any): void {
  console.log('> handler');
  console.log(`- name:${event.name}`);

  const defaultText: string = process.env.DEFAULT_GREETING || 'Hello World!';
  const response: any = {};

  if (isNullOrEmpty(event.name)) {
    response.text = defaultText;
  } else {
    response.text = `Hello ${event.name}!`;
  }

  console.log('< handler');
  callback(undefined, response);
}
