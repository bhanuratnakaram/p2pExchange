class OrderBook {
    constructor(link) {
      this.link = link;
      this.bids = [];
      this.asks = [];
      this.trades = [];
    }
    async storeToDHT(type, orders, callback) {
        //TBD store this to DHT with key type as property k
        await this.link.put({ v: JSON.stringify(orders) }, (err, hash) => {
          if (err) {
            console.error('Error saving data to DHT:', err);
          } else {
            console.log('Data saved to DHT with hash:', hash);
            callback(hash);
          }
        });
      }

    //get from DHT
    async getFromDHT(type, hash, callback) {
        //TBD get this from DHT with key type as property k
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
        //TBD : the asks has should be derived from string 'asks' and asks should be retrieved from DHT      
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
    //TBD: retrieve this from 'bids' hash key from DHT
    // this.bids = this.bidsHash ? await this.getFromDHT(this.bidsHash, (data) => {
    //     return JSON.parse(data.v);
    //     }) : this.bids;
      return this.bids;
    }
  
    getAsks() {
      //TBD: retrieve this from 'asks' hash key from DHT
      return this.asks;
    }
    getTrades() {
          //TBD: retrieve this from 'trades' hash key from DHT
        return this.trades;
      }
    updateBestBid() {
        //TBD update this to DHT
        this.bids.sort((a, b) => b.price - a.price);
    }  
    
    updateBestAsk() {
        //TBD update this to DHT
    this.asks.sort((a, b) => a.price - b.price);
    }
    getBestBid(order) {
      //TBD get this from DHT
      return this.bids.length>0 ? this.bids[0]:order;
    }
  
    getBestAsk(order) {
      //TBD get this from DHT
      return this.asks.length>0 ? this.asks[0]:order;
    }
    removeBestBid() {
        this.bids.shift();
        console.log('best bid removed');
        this.updateBestBid();
        //TBD update new bids to DHT with key 'bids'
    }

    removeBestAsk() {
        this.asks.shift();
        console.log('best ask removed');
        this.updateBestAsk();
        //TBD update new asks to DHT with key 'asks'
    }
  }
  //export OrderBook
    module.exports = OrderBook;