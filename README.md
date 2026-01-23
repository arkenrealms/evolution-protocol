# Protocol for Arken: Evolution Isles

A battle for supremecy takes place amongst the dragons of Haerra.

## Setup


## Handshake

Client-> load()
Server-> onLoaded(1)
Client-> login({name, network, address, device, signature, version})

```json
{"id":"696f29a9ad07abe0e6160acb","method":"login","type":"mutation","params":"{\"name\":\"Name\",\"network\":\"bsc\",\"address\":\"0x954246b18fe...5b78D88e8891d5\",\"device\":\"desktop\",\"signature\":\"0x363c0902b924f1...25a893763b14d818c1b\",\"version\":\"1.9.0\"}"}
```

## Events

Server-> onClearLeaderboard()
Server-> onUpdateBestClient("Name:0:54:0:0:52:2:0:-:1")
Server-> onSpawnReward("696f29b792fee6493135619a:0:pepe:1:-7.290003:-12.9074")
