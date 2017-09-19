import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';
import * as _ from 'lodash';

import { Greeting } from './greeting';

export class GreetingService {

  tableName: string = process.env.TABLE_NAME;
  ddb: AWS.DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

  findById(id: string): Rx.Observable<Greeting>|any {
    console.log(`> findAll`);

    const params: any = {
      TableName: this.tableName,
      Key: {
        'id': { S: `${id}` }
      }
    };
    console.log(`- params: ${JSON.stringify(params)}`);

    const getItem: any =
      Rx.Observable.bindNodeCallback(this.ddb.getItem.bind(this.ddb));

    console.log(`< findAll`);
    return getItem(params)
      .map((data: any) => {
        console.log(`- map`);
        console.log(`- data: ${JSON.stringify(data)}`);
        if (data.Item) {
          const greeting: Greeting = new Greeting();
          greeting.id = _.get(data, 'Item.id.S', '');
          greeting.text = _.get(data, 'Item.text.S', '');
          return greeting;
        } else {
          return {};
        }
      });
  }

}
