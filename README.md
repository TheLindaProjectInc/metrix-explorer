# Metrix Explorer

How to deploy Metrix-Explorer

https://github.com/TheLindaProjectInc/Metrix-Explorer

Prerequisites
* node.js v12.0+
* mysql v8.0+
* redis v5.0+
* Nginx v2+ - *optional


To host all parts of this on a single system we recommend using Nginx as the web service. 
This allows the correct proxying of incoming connection to the respective backend service.

## Deploy Metrix Core

Either build from source as below or grab the latest core from

https://github.com/TheLindaProjectInc/Metrix/releases/latest

### Build from source
1. `git clone --recursive https://github.com/TheLindaProjectInc/metrix.git`
2.  `git checkout metrixinfo`
3. Follow the instructions of https://github.com/TheLindaProjectInc/metrix/blob/master/README.md#building-metrix-core to build Metrix
4. Add the following to metrix.conf
```
        server=1
        daemon=1
        txindex=1
        addressindex=1
        addrindex=1
        timestampindex=1
        spentindex=1
        logevents=1
```
5. Run metrixd

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


**N.B** If you have mysql version 8+ then you need to change the user account that is used to access as below.
This changes from `caching_sha2_password` to `mysql_native_password`. This is due to a downlevel version of sequalize used that doesn't support new auth types.

```
use mysql;
ALTER USER 'myuseraccount'@'%' IDENTIFIED WITH mysql_native_password BY 'thisismysecurepassword';
FLUSH PRIVILEGES;
```


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
2. `npm run build` to generate defaults.
3. Setup the `.env` configuration file. If you are hosting everything on one server then the defaults should get you going once the dns names are updated.
4. `npm run build` to build app with `.env` config.
5. `npm start`

To run the UI in dev mode edit the package.json file and insert the follwing into the `"DEV: "` section. This allows live editing of the site, without the requirement to rebuild & start after every edit.
```
"DEV": "METRIXINFO_API_BASE_SERVER=http://127.0.0.1:7001/ METRIXINFO_API_BASE_CLIENT=http://<externalip>:7001 METRIXINFO_API_BASE_WS=//<externalip>/ METRIX_NETWORK=testnet HOST=0.0.0.0 PORT=80 nuxt"
```

Run the prod processes in pm2. when development is complete.


# Nginx configuration

The following assumes this is a clean installation of Nginx.

Add the below to your `/etc/nginx/sites-enabled/defaults` file.

Update the `server_name` to your extenal dns name.

```
        server_name my-external-dns.outside.com;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404
                proxy_pass http://localhost:1676;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_set_header X-Client-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:7001/;
        }

        location /socket.io/ {
            proxy_pass http://127.0.0.1:7001/socket.io/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        listen 80 default_server;
        listen [::]:80 default_server;
```


# SSL Configuration

The quick and easy way to secure your installation is using LetsEncrypt.

```
apt install certbot python3-certbot-nginx
```

Then 

```
certbot --nginx -d my-external-dns.outside.com
```

Follow the prompts to issue the certificate. Certbot with automatically update the nginx config to use SSL.

Add the following to your crontab to automatically renew. This checks daily at noon.
```
0 12 * * * /usr/bin/certbot renew --quiet
```

# API Docs
Full API Documentation
[API documentation](https://github.com/TheLindaProjectInc/metrix-explorer-api/blob/master/metrix-explorer-api/README.md)