# Metrix-Explorer-API Documentation

* [Pagination Parameters](#pagination-parameters)
* [Block / Timestamp Filter Parameters](#block--timestamp-filter-parameters)
* [Blockchain](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/blockchain.md)
  * [Blockchain Information](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/blockchain.md#Blockchain-Information)
  * [Supply](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/blockchain.md#Supply)
  * [Circulating Supply](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/blockchain.md#Circulating-Supply)
  * [Total Max Supply](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/blockchain.md#Total-Max-Supply)
* [Block](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/block.md)
  * [Block Information](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/block.md#Block-Information)
  * [Blocks of Date](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/block.md#Blocks-of-Date)
  * [Recent Blocks](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/block.md#Recent-Blocks)
* [Transaction](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/transaction.md)
  * [Transaction Information](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/transaction.md#Transaction-Information)
  * [Raw Transaction](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/transaction.md#Raw-Transaction)
  * [Send Raw Transaction](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/transaction.md#Send-Raw-Transaction)
* [Address](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md)
  * [Address Information](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-Information)
  * [Address Balance](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-Balance)
  * [Address Transactions](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-Transactions)
  * [Address Basic Transactions](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-Basic-Transactions)
  * [Address Contract Transactions](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-Contract-Transactions)
  * [Address MRC20 Token Transactions](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-MRC20-Token-Transactions)
  * [Address UTXO List](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-UTXO-List)
  * [Address Balance History](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-Balance-History)
  * [Address MRC20 Balance History](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/address.md#Address-MRC20-Balance-History)
* [Contract](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md)
  * [Contract Information](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#Contract-Information)
  * [Contract Transactions](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#Contract-Transactions)
  * [Contract Basic Transactions](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#Contract-Basic-Transactions)
  * [Call Contract](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#Call-Contract)
  * [Search Logs](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#Search-Logs)
* [MRC20](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md)
  * [MRC20 list](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#MRC20-list)
  * [MRC20 Transaction list](https://github.com/TheLindaProjectInc/metrix-explorer/blob/master/metrix-explorer-api/doc/contract.md#MRC20-Transaction-list)


## API Endpoint
* `https://explorer.metrixcoin.com/api/` for mainnet
* `https://explorer-testnet.metrixcoin.com/api/` for testnet


## Pagination Parameters

You may use one of 3 forms below, all indices count from 0, maximum 100 records per page:
* `limit=20&offset=40`
* `from=40&to=59`
* `pageSize=20&page=2`


## Block / Timestamp Filter Parameters

These params are available in some transaction list queries,
records are picked only when `fromBlock <= blockHeight <= toBlock`, `fromTime <= blockTimestamp <= toTime`.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fromBlock</code></td>
            <td>Number (optional)</td>
            <td>Search blocks from height</td>
        </tr>
        <tr>
            <td><code>toBlock</code></td>
            <td>Number (optional)</td>
            <td>Search blocks until height</td>
        </tr>
        <tr>
            <td><code>fromTime</code></td>
            <td>ISO 8601 Date String (optional)</td>
            <td>Search blocks from timestamp</td>
        </tr>
        <tr>
            <td><code>toTime</code></td>
            <td>ISO 8601 Date String (optional)</td>
            <td>Search blocks until timestamp</td>
        </tr>
    </tbody>
</table>
