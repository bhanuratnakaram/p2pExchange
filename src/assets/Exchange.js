const Grenache = require('grenache-nodejs-http');
const Peer = Grenache.PeerRPCServer;
const Link = require('grenache-nodejs-link');
const OrderBook = require('./OrderBook');
const MatchingEngine = require('./MatchingEngine');

class Exchange {
  constructor(url) {
    this.link = new Link({
      grape: url,
      requestTimeout: 10000
    });
    this.link.start();
    this.peer = new Peer(this.link, {
        timeout: 300000
      })
    this.orderBook = new OrderBook(this.link);
    this.MatchingEngine = new MatchingEngine(this.orderBook);
  }

  async submitOrder(order) {
    //add order to order book

    //handle order
    await this.MatchingEngine.addOrder(order);
  }

   start() {
    //init peer
    this.peer.init();
    //create a service
    this.service = this.peer.transport('server')
    //listen on a random port
    this.service.listen(Math.floor(Math.random() * 10000) + 10000)
    console.log('listening on', this.service.port);
    //announce service
    // setInterval(function () {
    //     this.link.announce('order', this.service.port, {})
    //   }.bind(this), 1000)
    //handle order
    // this.service.on('order', (rid, key, orderPayload, handler) => {
    //     console.log('order received', orderPayload.toString());
    //   this.handleOrder(orderPayload);
    // });
  }
  stop(){
    this.peer.stop();
    this.link.stop();}
}

//export default Exchange;
module.exports = Exchange;