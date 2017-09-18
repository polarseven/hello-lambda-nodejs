import * as AWS from 'aws-sdk';

import { Greeting } from './greeting';

export class GreetingService {

  findById(id: string): void {
    console.log(`> findAll`);

    const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

    const params: any = {
      TableName: 'Greeting',
      Key: {
        'id': { S: `${id}` }
      }
    };

    ddb.getItem(params, (err, data) => {
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
