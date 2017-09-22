import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

import { Greeting } from './greeting';

export class GreetingService {

  greetingTable: string = process.env.TABLE_NAME;
  greetingValueGsi: string = process.env.GSI_VALUE_NAME;
  ddb: AWS.DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

  findById(id: string): Rx.Observable<Greeting> | any {
    console.log(`> findById`);

    const params: any = {
      TableName: this.greetingTable,
      Key: {
        'id': { S: `${id}` }
      }
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const getItem: any =
      Rx.Observable.bindNodeCallback(this.ddb.getItem.bind(this.ddb));

    console.log(`< findById`);
    return getItem(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        if (data.Item) {
            const greeting: Greeting = new Greeting();
            greeting.id = _.get(data, 'Item.id.S', '');
            greeting.language = _.get(data, 'Item.language.S', '');
            greeting.value = _.get(data, 'Item.value.S', '');
            return greeting;
        } else {
          return {};
        }
      });
  }

  findByValue(value: string, language: string = 'en'): Rx.Observable<Greeting> | any {
    console.log(`> findByValue`);

    const params: any = {
      TableName: this.greetingTable,
      IndexName: this.greetingValueGsi,
      Limit: 1,
      KeyConditionExpression: 'language = :lang AND value = :val',
      ExpressionAttributeValues: {
        ':lang': { S: `${language}` },
        ':val': { S: `${value}` }
      }
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const query: any =
      Rx.Observable.bindNodeCallback(this.ddb.query.bind(this.ddb));

    console.log(`< findByValue`);
    return query(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        if (data.Count === 0) {
          return {};
        } else {
          for (const item of data.Items) {
            const greeting: Greeting = new Greeting();
            greeting.id = _.get(item, 'id.S', '');
            greeting.language = _.get(item, 'language.S', '');
            greeting.value = _.get(item, 'value.S', '');
            return greeting;
          }
        }
      });
  }

  findAll(): Rx.Observable<Greeting[]> | any {
    console.log(`> findAll`);

    const params: any = {
      TableName: this.greetingTable,
      Limit: 1000
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const scan: any =
      Rx.Observable.bindNodeCallback(this.ddb.scan.bind(this.ddb));

    console.log(`< findAll`);
    return scan(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        if (data.Count === 0) {
          return [];
        } else {
          const greetings: Greeting[] = [];
          for (const item of data.Items) {
            const greeting: Greeting = new Greeting();
            greeting.id = _.get(item, 'id.S', '');
            greeting.language = _.get(item, 'language.S', '');
            greeting.value = _.get(item, 'value.S', '');

            greetings.push(greeting);
          }
          return greetings;
        }
      });
  }

  update(greeting: Greeting): Rx.Observable<Greeting> | any {
    console.log(`> update`);

    const params: any = {
      TableName: this.greetingTable,
      ExpressionAttributeNames: {
        '#language': 'language',
        '#value': 'value'
      },
      ExpressionAttributeValues: {
        ':language': { S: `${greeting.language}` },
        ':value': { S: `${greeting.value}` }
      },
      Key: {
        'id': { S: `${greeting.id}` }
      },
      UpdateExpression: 'SET #language = :language, #value = :value '
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const updateItem: any =
      Rx.Observable.bindNodeCallback(this.ddb.updateItem.bind(this.ddb));

    console.log(`< update`);
    return updateItem(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        return {};
      });
  }

  save(greeting: Greeting): Rx.Observable<Greeting> | any {
    console.log(`> save`);

    greeting.id = uuid();

    const params: any = {
      TableName: this.greetingTable,
      Item: {
        'language': { S: `${greeting.language}` },
        'value': { S: `${greeting.value}` },
        'id': { S: `${greeting.id}` }
      },
      ConditionExpression: `attribute_not_exists(id)`
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const putItem: any =
      Rx.Observable.bindNodeCallback(this.ddb.putItem.bind(this.ddb));

    console.log(`< save`);
    return putItem(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        return greeting;
      });
  }

}
