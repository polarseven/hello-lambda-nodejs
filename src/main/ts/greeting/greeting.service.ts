import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

import { Greeting } from './greeting';

export class GreetingService {

  greetingTable: string = process.env.TABLE_NAME;
  greetingReferenceGsi: string = process.env.GSI_REFERENCE_NAME;
  ddb: AWS.DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

  findByReferenceId(referenceId: string): Rx.Observable<Greeting>|any {
    console.log(`> findByReferenceId`);

    const params: any = {
      TableName: this.greetingTable,
      IndexName: this.greetingReferenceGsi,
      Limit: 1,
      KeyConditionExpression: 'referenceId = :refId',
      ExpressionAttributeValues: {
        ':refId': { S: `${referenceId}` }
      }
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const query: any =
      Rx.Observable.bindNodeCallback(this.ddb.query.bind(this.ddb));

    console.log(`< findByReferenceId`);
    return query(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        if (data.Count === 0) {
          return {};
        } else {
          for (const item of data.Items) {
            const greeting: Greeting = new Greeting();
            greeting.referenceId = _.get(item, 'referenceId.S', '');
            greeting.language = _.get(item, 'language.S', '');
            greeting.value = _.get(item, 'value.S', '');
            return greeting;
          }
        }
      });
  }

  save(greeting: Greeting): Rx.Observable<Greeting>|any {
    console.log(`> save`);

    greeting.referenceId = uuid();

    const params: any = {
      TableName: this.greetingTable,
      Item: {
        'language': { S: `${greeting.language}` },
        'value': { S: `${greeting.value}` },
        'referenceId': { S: `${greeting.referenceId}` }
      },
      ConditionExpression: `attribute_not_exists(referenceId)`
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
