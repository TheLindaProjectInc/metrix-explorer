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

## Total Max Supply

**Request**
```
GET /dgpinfo
```

**Response**
```json
{
  "maxBlockSize":2000000,
  "minGasPrice":5000,
  "blockGasLimit":40000000,
  "governanceCollateral":7500000,
  "budgetFee":600000
}
```

## Total Max Supply

**Request**
```
GET /governorlocked
```

**Response**
```json
1215000000
```

## Total Max Supply

**Request**
```
GET /governorlist
```

**Response**
```json
{
  "governorCount":163,
  "governorList":{"1e9c03f2be407b25f9a53fbe5ee07c1af9134183":"MAh1QKuJyXzoqAdXNZt4fDAufyeaYDA8DK","40f1e8e0e581a67d4836ee46e779ca0f00770848":"MDpZGtP49UHntKUJBHozPua5R8Knxj3FCR","d7a47167acf8b5993c3595abd7e6f8fd52d6ee1f":"MTZNWNaYDaeyj2E6rBgsEP8ZnQZYi8Ef4V","2ce1ec7e83ed807e7b15e4f8b186915f51964bf3":"MBzUcLCrKZmmKRJDqhHNZAFVj8XueBtj1K"}
}
```