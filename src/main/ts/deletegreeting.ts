import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';

import { Greeting } from './greeting/greeting';
import { GreetingService } from './greeting/greeting.service';

/**
 * The Lambda request handler. This handler deletes a Greeting object from the
 * database.
 * @param event The input data object.
 * @param context The Lambda Context object.
 * @param callback The callback function. Invoke when the Lambda handler
 *                 operation is complete to return data or an error.
 */
export function handler(event: any, context: any, callback: any): void {
  console.log(`> handler`);
  console.log(`- event: ${JSON.stringify(event)}`);
  const greeting: Greeting = JSON.parse(event.body) as Greeting;
  console.log(`- event.body: ${JSON.stringify(greeting)}`);

  const greetingService: GreetingService = new GreetingService();
  const response: any = {};
  response.statusCode = 200;

  greetingService.delete(greeting.id)
    .subscribe((result: Object) => {
      console.log(`- subscribe`);
      response.body = JSON.stringify(result);
      console.log(`- response: ${JSON.stringify(response)}`);
      console.log(`< handler`);
      callback(undefined, response);
    }, (err: any) => {
      console.error(err, err.stack);
      response.statusCode = 500;
      response.body = err;
      console.log(`< handler`);
      callback(undefined, response);
    });

}
