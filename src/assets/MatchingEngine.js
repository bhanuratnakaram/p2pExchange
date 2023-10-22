const AsyncLock = require('async-lock');

class MatchingEngine {
  constructor(orderBook) {
    this.orderBook = orderBook;
    this.lock = new AsyncLock();
  }

  async addOrder(order) {
    await this.lock.acquire('order', async () => {
      await this.orderBook.addOrder(order);
      await this.matchOrders();
    });
  }

  async matchOrders() {
    const bids = await this.orderBook.getBids();
    const asks = await this.orderBook.getAsks();
    console.log(bids)
    console.log(asks)
    const trades = await this.matchOrdersInternal(bids, asks);
    console.log(trades);
    console.log(Array.isArray(trades))
    if (Array.isArray(trades)) {
      for (const trade of trades) {
        await this.orderBook.addTrade(trade);
      }
    }
    console.log(this.orderBook.trades);
  }

  async matchOrdersInternal(bids, asks) {
    const trades = [];
    let i = 0;
    let j = 0;
    while (i < bids.length && j < asks.length) {
      const bid = bids[i];
      const ask = asks[j];
  
      if (bid.price >= ask.price && bid.quantity > 0 && ask.quantity > 0) {
        const quantity = Math.min(bid.quantity, ask.quantity);
        trades.push({ price: ask.price, quantity });
        bid.quantity -= quantity;
        ask.quantity -= quantity;
  
        if (bid.quantity === 0) {
          await this.orderBook.removeBestBid(bid);
          i++;
        }
        if (ask.quantity === 0) {
          await this.orderBook.removeBestAsk(ask);
          j++;
        }
      } else {
        break;
      }
    }
    return trades;
  }
}
//Export the class
module.exports = MatchingEngine;