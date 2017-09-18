import * as AWS from 'aws-sdk';

import { Greeting } from './greeting/greeting';
import { GreetingService } from './greeting/greeting.service';

export function handler(event: any, context: any, callback: any): void {
  console.log(`> handler`);

  const response: any = {};

  const greetingService: GreetingService = new GreetingService();

  greetingService.findById(event.id);

  console.log(`< handler`);
  callback(undefined, response);
}
