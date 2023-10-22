# p2pExchange

<img src="logo.png" width="15%" />

### Requirements

Install `Grenache Grape`: https://github.com/bitfinexcom/grenache-grape:

```bash
npm i -g grenache-grape
```

```
// Start 2 Grapes
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Class: Exchange

Instantiates Orderbook, accepts orders and connects to grape

### Class: Matching Engine
Match the orders, settles and updates the orderbook

#### Class OrderBook
Orderbook to collect bid and ask orders. It also updates DHT with the order information


#### tests
run npm test to see the scenarios of order matching working

#### TBD
To workout storing the orders using key value pair in DHT. The current grenache documentation unclear on how to achieve this but there should be way to store the same with option `k`. 

The idea is  - store bids with key `bids`, asks with key `asks`. When order is sent, addBid/addAsk will retrieve all the bids/asks from DHT, sort it, and push back to DHT after order matching process is completed by the matching engine. That is because matching engine can modify some buy and sell orders. The distributed orders can be achieved this way. In other words, every time order is placed, the whole DHT is replaced with new set of orders on completion of trade matching. 

In ideal world, each asset pair can have separate matching engines to avoid high traffic. 