import * as _ from 'lodash';
import * as AWS from 'aws-sdk';

export function handler(event: any, context: any, callback: any): void {
  console.log('> handler');

  const response: any = {};
  const s3 = new AWS.S3();

  s3.listBuckets((err, data) => {
    if (err) {
      console.error(err);
      console.log('< handler');
      callback(err, response);
    } else {
      console.log(`- S3 raw response: ${JSON.stringify(data)}`);
      if (data.Buckets) {
        response.bucketNames = _.map(data.Buckets, 'Name');
      }
      console.log(`- response: ${JSON.stringify(response)}`);
      console.log('< handler');
      callback(undefined, response);
    }
  });
}
