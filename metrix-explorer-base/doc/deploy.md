# How to Deploy qtuminfo

qtuminfo is splitted into 3 repos:
* [https://github.com/TheLindaProjectInc/qtuminfo](https://github.com/TheLindaProjectInc/metrixinfo)
* [https://github.com/TheLindaProjectInc/qtuminfo-api](https://github.com/TheLindaProjectInc/metrixinfo-api)
* [https://github.com/TheLindaProjectInc/qtuminfo-ui](https://github.com/TheLindaProjectInc/metrixinfo-ui)

## Prerequisites

* node.js v12.0+
* mysql v8.0+
* redis v5.0+

## Deploy qtum core
1. `git clone --recursive https://github.com/TheLindaProjectInc/metrix-qtum.git --branch=metrixinfo`
1. `git checkout master`
2. Follow the instructions of [https://github.com/TheLindaProjectInc/metrix-qtum/blob/master/README.md#building-metrix-core](https://github.com/TheLindaProjectInc/metrix-qtum/blob/master/README.md#building-metrix-core) to build Metrix
3. Run `metrixd` with `-logevents=1` enabled

## Deploy qtuminfo
1. `git clone https://github.com/TheLindaProjectInc/metrixinfo.git`
2. `cd metrixinfo && npm install`
3. Create a mysql database and import [docs/structure.sql](structure.sql)
4. Edit file `metrixinfo-node.json` and change the configurations if needed.
5. `npm run dev`

It is strongly recommended to run `metrixinfo` under a process manager (like `pm2`), to restart the process when `metrixinfo` crashes.

## Deploy qtuminfo-api
1. `git clone https://github.com/TheLindaProjectInc/metrixinfo-api.git`
2. `cd metrixinfo-api && npm install`
3. Create file `config/config.prod.js`, write your configurations into `config/config.prod.js` such as:
    ```javascript
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
    ```
    This will override corresponding field in `config/config.default.js` while running.
4. `npm start`

## Deploy qtuminfo-ui
This repo is optional, you may not deploy it if you don't need UI.
1. `git clone https://github.com/TheLindaProjectInc/metrixinfo-ui.git`
2. `cd metrixinfo-ui && npm install`
3. Edit `package.json` for example:
   * Edit `script.build` to `"build": "METRIXINFO_API_BASE_CLIENT=/api/ METRIXINFO_API_BASE_SERVER=http://localhost:3001/ METRIXINFO_API_BASE_WS=//example.com/ nuxt build"` in `package.json` to set the api URL base
   * Edit `script.start` to `"start": "PORT=3000 nuxt start"` to run `metrixinfo-ui` on port 3000
4. `npm run build`
5. `npm start`
