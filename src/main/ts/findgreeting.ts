import * as AWS from 'aws-sdk';
import * as Rx from 'rxjs/Rx';

import { Greeting } from './greeting/greeting';
import { GreetingService } from './greeting/greeting.service';

export function handler(event: any, context: any, callback: any): void {
  console.log(`> handler`);

  const greetingService: GreetingService = new GreetingService();

  greetingService.findById(event.id)
    .subscribe((greeting: any) => {
      console.log(`- subscribe`);
      console.log(`- greeting: ${JSON.stringify(greeting)}`);
      console.log(`< handler`);
      callback(undefined, greeting);
    }, (err: any) => {
      console.error(err);
      console.log(`< handler`);
      callback(err, {});
    });

}
