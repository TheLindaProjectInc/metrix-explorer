# Metrix Explorer

How to deploy Metrix-Explorer

https://github.com/TheLindaProjectInc/Metrix-Explorer

Prerequisites
* node.js v12.0+
* mysql v8.0+
* redis v5.0+

## Deploy Metrix Core

1. `git clone --recursive https://github.com/TheLindaProjectInc/metrix-qtum.git --branch=metrixinfo`
2.  `git checkout metrixinfo`
3. Follow the instructions of https://github.com/TheLindaProjectInc/metrix-qtum/blob/master/README.md#building-metrix-core to build Metrix
4. Add the following to metrix.conf
```
        txindex=1
        addressindex=1
        addrindex=1
        timestampindex=1
        spentindex=1
```
5. Run metrixd with `-logevents -daemon`

# Deploy Metrix-Explorer
The explorer comes in 3 components
* Base
* API
* UI

Each item is a seperate application, and must be installed and configured as such.

## Deploy metrix-explorer-base
1. `git clone https://github.com/TheLindaProjectInc/Metrix-Explorer.git`
2. `cd cd ~/Metrix-Explorer/metrix-explorer-base && npm install`
3. Create a mysql database and import docs/structure.sql
4. Edit file metrixinfo-node.json and change the configurations if needed.
You should already have created a mysql DB and a user/password to access it with.
```
{
  "version": "0.0.1",
  "chain": "testnet", \\Change this for the network to use
  "services": [
    "db",
    "p2p",
    "header",
    "block",
    "transaction",
    "contract",
    "mempool",
    "server"
  ],
  "servicesConfig": {
    "db": {
      "mysql": {
        "uri": "mysql://<DBUSERNAME>:<DBPASSWORD>@localhost/<DBNAME>" \\change these placeholders with your real DB info
      },
      "rpc": {
        "protocol": "http",
        "host": "localhost",
        "port": 33831, \\update this if you connect to mainnet or testnet
        "user": "<RPCUSER>", \\Update RPC credentials
        "password": "<RPCPASSWORD>", \\Update RPC credentials
        "loggers": "debug"
      }
    },
    "p2p": {
      "peers": [
        {
          "ip": {
            "v4": "127.0.0.1"
          },
          "port": 33830 \\Change this port it the network is mainnet or testnet
        }
      ]
    },
    "server": {
      "port": 3001
    }
  }
}
```


5. `npm run dev`  
It is strongly recommended to run metrixinfo under a process manager (like pm2), to restart the process when metrixinfo crashes.
6. Running under pm2 with `pm2 start "npm run dev"`

## Deploy metrix-explorer-api

1. `cd ~/Metrix-Explorer/metrix-explorer-api && npm install`
2. Create file config/config.prod.js, write your configurations into config/config.prod.js such as:
```
        exports.security = {
            domainWhiteList: ['http://example.com']  // CORS whitelist sites
        }
        // or
        exports.cors = {
            origin: '*'  // Access-Control-Allow-Origin: *
        }

        exports.sequelize = {
            logging: false  // disable sql logging
        }

        exports.sequelize = { // UPDATE DBNAME, USERNAME and PASSWORD here.
        dialect: 'mysql',
        database: '<DBNAME>',
        host: 'localhost',
        port: 3306,
        username: '<DBUSERNAME>',
        password: '<DBPASSWORD>'
        }

        exports.metrix = {
            chain: 'testnet'  // Update this to the correct network
        }

        exports.metrixinfo = {
        path: path.resolve('..', 'metrixinfo'),
        port: 3001,
        rpc: {
            protocol: 'http',
            host: 'localhost',
            port: 33831, // RPC PORT
            user: '<RPCUSERNAME>', // RPC Username
            password: '<RPCPASSWORD>' // RPC Password
        }
}

```
This will override corresponding field in config/config.default.js while running.

3. `npm start`

## Deploy metrix-explorer-ui
This repo is optional, you may not deploy it if you don't need UI.

1. `cd metrix-explorer-ui && npm install`
2. Edit package.json for example:
Edit script.build to `"build": "METRIXINFO_API_BASE_SERVER=http://localhost:7001/ METRIXINFO_API_BASE_CLIENT=http://externaldnsname.com:7001 METRIXINFO_API_BASE_WS=//externaldnsname.com/ METRIX_NETWORK=testnet nuxt build"` in package.json to set the api URL base
3. Edit script.start to `"start": "HOST=0.0.0.0 PORT=80 nuxt start"` to run metrix-explorer-ui on port 80
4. `npm run build`
5. `npm start`

To run the UI in dev mode edit the package.json file and insert the follwing into the `"DEV: "` section. This allows live editing of the site, without the requirement to rebuild & start after every edit.
```
"DEV": "METRIXINFO_API_BASE_SERVER=http://127.0.0.1:7001/ METRIXINFO_API_BASE_CLIENT=http://<externaldns>:7001 METRIXINFO_API_BASE_WS=//<externaldns>/ METRIX_NETWORK=testnet HOST=0.0.0.0 PORT=80 nuxt"
```

Run the prod processes in pm2. when development is complete.