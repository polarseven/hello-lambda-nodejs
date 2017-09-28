import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';

import { Greeting } from './greeting/greeting';
import { GreetingService } from './greeting/greeting.service';

export function handler(event: any, context: any, callback: any): void {
  console.log(`> handler`);
  console.log(`- event: ${JSON.stringify(event)}`);
  const id: string = event.pathParameters.greetingId;

  const greetingService: GreetingService = new GreetingService();
  const response: any = {};
  response.statusCode = 200;

  greetingService.findById(id)
    .subscribe((greeting: any) => {
      console.log(`- subscribe`);
      response.body = JSON.stringify(greeting);
      console.log(`- response: ${JSON.stringify(response)}`);
      console.log(`< handler`);
      callback(undefined, response);
    }, (err: any) => {
      console.error(err);
      response.statusCode = 500;
      response.body = err;
      console.log(`< handler`);
      callback(undefined, err);
    });

}
