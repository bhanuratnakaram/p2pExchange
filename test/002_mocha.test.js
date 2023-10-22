const Exchange = require('../src/assets/Exchange');
var chai = require('chai')
  , chaiHttp = require('chai-http')

chai.use(chaiHttp)
var expect = chai.expect
// const assert = require('assert');

describe('Exchange', () => {
  let exchange;

  beforeEach(() => {
    exchange = new Exchange('http://127.0.0.1:30001');
    exchange.start();
  });

  afterEach(() => {
    exchange.stop();
  });

  it('submitOrder() should add order to order book', async () => {
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });

    const bids = await exchange.orderBook.getBids();

    expect(bids.length).to.eql(1);
    expect(bids[0].price).to.eql(100);
    expect(bids[0].quantity).to.eql(100);
  });

  it('getBids() should return all bids in order book', async () => {
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });
    await exchange.submitOrder({ type: 'bid', price: 90, quantity: 50 });

    const bids = await exchange.orderBook.getBids();

    expect(bids.length).to.eql(2);
    expect(bids[0].price).to.eql(100);
    expect(bids[0].quantity).to.eql(100);
    expect(bids[1].price).to.eql(90);
    expect(bids[1].quantity).to.eql(50);
  });

  it('getAsks() should return all asks in order book', async () => {
    await exchange.submitOrder({ type: 'ask', price: 100, quantity: 6 });
    await exchange.submitOrder({ type: 'ask', price: 110, quantity: 10 });

    const asks = await exchange.orderBook.getAsks();

    expect(asks.length).to.eql(2);
    expect(asks[0].price).to.eql(100);
    expect(asks[0].quantity).to.eql(6);
    expect(asks[1].price).to.eql(110);
    expect(asks[1].quantity).to.eql(10);
  });

  it('getTrades() should return all trades in order book', async () => {
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });
    await exchange.submitOrder({ type: 'ask', price: 100, quantity: 6 });

    const trades = await exchange.orderBook.getTrades();

    expect(trades.length).to.eql(1);
    expect(trades[0].price).to.eql(100);
    expect(trades[0].quantity).to.eql(6);

    //asks should be empty
    const asks = await exchange.orderBook.getAsks();
    expect(asks.length).to.eql(0);

    //bids should be 1 with reduced quantity
    const bids = await exchange.orderBook.getBids();

    expect(bids.length).to.eql(1);
    expect(bids[0].price).to.eql(100);
    expect(bids[0].quantity).to.eql(94);
  });


  it('multiple bids and asks', async () => {
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });
    await exchange.submitOrder({ type: 'ask', price: 100, quantity: 6 });
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });
    await exchange.submitOrder({ type: 'ask', price: 100, quantity: 6 });
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });
    await exchange.submitOrder({ type: 'ask', price: 100, quantity: 6 });
    await exchange.submitOrder({ type: 'bid', price: 100, quantity: 100 });
    await exchange.submitOrder({ type: 'ask', price: 100, quantity: 6 });

    const trades = await exchange.orderBook.getTrades();

    expect(trades.length).to.eql(4);
    expect(trades[0].price).to.eql(100);
    expect(trades[0].quantity).to.eql(6);
    expect(trades[1].price).to.eql(100);
    expect(trades[1].quantity).to.eql(6);
    expect(trades[2].price).to.eql(100);
    expect(trades[2].quantity).to.eql(6);
    expect(trades[3].price).to.eql(100);
    expect(trades[3].quantity).to.eql(6);

    //asks should be empty
    const asks = await exchange.orderBook.getAsks();
    expect(asks.length).to.eql(0);

    //bids should be 1 with reduced quantity
    const bids = await exchange.orderBook.getBids();

    expect(bids.length).to.eql(4);
    expect(bids[0].price).to.eql(100);
  });
});