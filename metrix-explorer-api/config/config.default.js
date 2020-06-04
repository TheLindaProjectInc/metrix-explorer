const path = require('path')
const Redis = require('ioredis')

const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: '',
  db: 0
}

exports.keys = 'metrixinfo-api'

exports.security = {
  csrf: {enable: false}
}

exports.cors = {
  origin: '*'  // Access-Control-Allow-Origin: *
}

exports.middleware = ['ratelimit']

exports.redis = {
  client: redisConfig
}

exports.ratelimit = {
  db: new Redis(redisConfig),
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  disableHeader: false,
  errorMessage: 'Rate Limit Exceeded',
  duration: 10 * 60 * 1000,
  max: 10 * 60
}

exports.io = {
  redis: {
    ...redisConfig,
    key: 'metrixinfo-api-socket.io'
  },
  namespace: {
    '/': {connectionMiddleware: ['connection']}
  }
}

exports.sequelize = {
  dialect: 'mysql',
  database: 'metrixinfo',
  host: 'localhost',
  port: 3306,
  username: 'metrixinfo',
  password: ''
}

exports.metrix = {
  chain: 'mainnet'
}

exports.metrixinfo = {
  path: path.resolve('..', 'metrixinfo'),
  port: 3001,
  rpc: {
    protocol: 'http',
    host: 'localhost',
    port: 33831,
    user: 'user',
    password: 'password'
  }
}

exports.cmcAPIKey = null
