class OrderBook {
    constructor(link) {
      this.link = link;
      this.bids = [];
      this.asks = [];
      this.trades = [];
    }
    async storeToDHT(order, callback) {
        await this.link.put({ v: JSON.stringify(order) }, (err, hash) => {
          if (err) {
            console.error('Error saving data to DHT:', err);
          } else {
            console.log('Data saved to DHT with hash:', hash);
            callback(hash);
          }
        });
      }

    //get from DHT
    async getFromDHT(hash, callback) {
        await this.link.get(hash, (err, data) => {
          if (err) {
            console.error('Error getting data from DHT:', err);
          } else {
            console.log('Data retrieved from DHT:', data);
            callback(data);
          }
        });
      }
    
    async addOrder(order) {
        if (order.type === 'ask') {
            console.log('add ask');
            await this.addAsk(order);
            console.log('ask added');
        } else if(order.type === 'bid'){
            console.log('add bid');
            await this.addBid(order);
            console.log('bid added');
        } else {
            console.log(`order type ${order.type} not supported`);
        }
    }

    async addBid(bid) {
      this.bids = this.bidsHash ? await this.getFromDHT(this.bidsHash, (data) => {
        return JSON.parse(data.v);
      }) : this.bids;
      this.bids.push(bid);
      this.updateBestBid();
      await this.storeToDHT(this.bids, (hash) => {
        this.bidsHash = hash;
      });
    }
    
    async addAsk(ask) {
        this.asks = this.asksHash ? await this.getFromDHT(this.asksHash, (data) => {
            return JSON.parse(data.v);
          }) : this.asks;
        this.asks.push(ask);
        this.updateBestAsk();
      await this.storeToDHT(this.asks, (hash) => {
        this.asksHash = hash;

      });
    }
    async addTrade(trade) {
        this.trades.push(trade);
        await this.storeToDHT(trade, (hash) => {
            this.tradesHash = hash;
        });
    }

    async getBids() {
    this.bids = this.bidsHash ? await this.getFromDHT(this.bidsHash, (data) => {
        return JSON.parse(data.v);
        }) : this.bids;
      return this.bids;
    }
  
    getAsks() {
      return this.asks;
    }
    getTrades() {
        return this.trades;
      }
    updateBestBid() {
        this.bids.sort((a, b) => b.price - a.price);
    }  
    
    updateBestAsk() {
    this.asks.sort((a, b) => a.price - b.price);
    }
    getBestBid(order) {
      return this.bids.length>0 ? this.bids[0]:order;
    }
  
    getBestAsk(order) {
      return this.asks.length>0 ? this.asks[0]:order;
    }
    removeBestBid() {
        console.log(JSON.stringify(this.bids));
        this.bids.shift();
        console.log(JSON.stringify(this.bids));
        this.updateBestBid();
    }

    removeBestAsk() {
        this.asks.shift();
        this.updateBestAsk();
    }
  }
  //export OrderBook
    module.exports = OrderBook;