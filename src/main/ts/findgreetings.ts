import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';

import { Greeting } from './greeting/greeting';
import { GreetingService } from './greeting/greeting.service';

/**
 * The Lambda request handler. This handler retrieves a collection of
 * Greeting objects from the database.
 * @param event The input data object.
 * @param context The Lambda Context object.
 * @param callback The callback function. Invoke when the Lambda handler
 *                 operation is complete to return data or an error.
 */
export function handler(event: any, context: any, callback: any): void {
  console.log(`> handler`);

  const greetingService: GreetingService = new GreetingService();

  greetingService.findAll()
    .subscribe((greetings: Greeting[]) => {
      console.log(`- subscribe`);
      console.log(`- greetings: ${JSON.stringify(greetings)}`);
      console.log(`< handler`);
      callback(undefined, greetings);
    }, (err: any) => {
      console.error(err, err.stack);
      console.log(`< handler`);
      callback(err, {});
    });

}
