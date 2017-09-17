export function handler(event: any, context: any, callback: any): void {
  console.log('> handler');
  console.log('< handler');
  callback(undefined, 'pong');
}
