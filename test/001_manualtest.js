const Exchange = require('../src/assets/Exchange');

const exchange1 = new Exchange('http://127.0.0.1:30001');
const exchange2 = new Exchange('http://127.0.0.1:30001');

exchange1.start();
//exchange2.start();

exchange1.submitOrder({ type: 'bid', price: 100, quantity: 100 });
// exchange1.submitOrder({ type: 'ask', price: 100, quantity: 6 });
// exchange1.submitOrder({ type: 'ask', price: 100, quantity: 4 });
exchange2.submitOrder({ type: 'ask', price: 100, quantity: 5 });

setTimeout(async() => {
  //call getBids() and getAsks() on both exchanges and wait till response is received
  
  



  const bids1 = await exchange1.orderBook.getBids();
  const asks1 = exchange1.orderBook.getAsks();
  const trades1 = exchange1.orderBook.getTrades();
  // const bids2 = exchange2.orderBook.getBids();
  // const asks2 = exchange2.orderBook.getAsks();

  console.log('Exchange 1 bids:', bids1);
  console.log('Exchange 1 asks:', asks1);
  console.log('Exchange 1 trades:', trades1);
  // console.log('Exchange 2 bids:', bids2);
  // console.log('Exchange 2 asks:', asks2);
}, 1000);