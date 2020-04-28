const path = require('path')

const CHAIN = Symbol('metrix.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.metrixinfo.lib.Chain.get(this.config.metrix.chain)
    return this[CHAIN]
  },
  get metrixinfo() {
    return {
      lib: require(path.resolve(this.config.metrixinfo.path, 'lib')),
      rpc: require(path.resolve(this.config.metrixinfo.path, 'rpc'))
    }
  }
}
