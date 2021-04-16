# Blockchain API

- [Blockchain API](#Blockchain-API)
  - [Blockchain Information](#Blockchain-Information)
  - [Supply](#Supply)
  - [Circulating Supply](#Circulating-Supply)
  - [Total Max Supply](#Total-Max-Supply)


## Blockchain Information

**Request**
```
GET /info
```

**Response**
```json
{
  "height": 405961,
  "supply": 101603844,
  "circulatingSupply": 95853844,
  "netStakeWeight": 1095728543244388,
  "feeRate": 10,
  "dgpInfo": {
    "maxBlockSize": 2000000,
    "minGasPrice": 40,
    "blockGasLimit": 40000000
  }
}
```


## Supply

**Request**
```
GET /supply
```

**Response**
```json
17249478911
```

## Circulating Supply

**Request**
```
GET /circulating-supply
```

**Response**
```json
16034478911
```

## Total Max Supply

**Request**
```
GET /total-max-supply
```

**Response**
```json
107822406.25
```
