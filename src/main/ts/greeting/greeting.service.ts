import * as AWS from 'aws-sdk';

import { Greeting } from './greeting';

export class GreetingService {

  tableName: string = process.env.TABLE_NAME;
  ddb: AWS.DynamoDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

  findById(id: string): void {
    console.log(`> findAll`);

    const params: any = {
      TableName: this.tableName,
      Key: {
        'id': { S: `${id}` }
      }
    };

    console.log(`- params: ${JSON.stringify(params)}`);

    this.ddb.getItem(params, (err, data) => {
      if (err) {
        console.error(err);
        console.log(`< findAll`);
      } else {
        console.log(`- data: ${JSON.stringify(data)}`);
        console.log(`< findAll`);
      }
    });

  }

}
