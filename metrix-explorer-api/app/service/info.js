const {Service} = require('egg')
const {U256} = require('../../node_modules/uint256/dist/UInt256')
class InfoService extends Service {
  async getInfo() {
    let height = this.app.blockchainInfo.tip.height
    let stakeWeight = JSON.parse(await this.app.redis.hget(this.app.name, 'stakeweight')) || 0
    let feeRate = JSON.parse(await this.app.redis.hget(this.app.name, 'feerate')).find(item => item.blocks === 10).feeRate || 10
    let dgpInfo = JSON.parse(await this.app.redis.hget(this.app.name, 'dgpinfo')) || {}
    let blockchainInfo = JSON.parse(await this.app.redis.hget(this.app.name, 'blockchaininfo')) || {}
    let totalSupply = await this.getTotalSupply()
    let circulatingSupply = await this.getCirculatingSupply()
    return {
      height,
      supply: totalSupply,
      circulatingSupply: circulatingSupply,
      netStakeWeight: Math.round(stakeWeight),
      feeRate,
      dgpInfo,
      blockchainInfo
    }
  }

  async getTotalSupply() {
    let blockchainInfo = await this.getBlockChainInfo()
    return blockchainInfo.moneysupply
  }

  async getCirculatingSupply() {
    let totalSupply = await this.getTotalSupply()
    let governorLockedCoins = await this.getGovernorLockedCoins()
    return totalSupply - governorLockedCoins
  }

  getTotalMaxSupply() {
    return 30e17;
  }

  async getStakeWeight() {
    const {Header} = this.ctx.model
    const {gte: $gte} = this.app.Sequelize.Op
    let height = await Header.aggregate('height', 'max', {transaction: this.ctx.state.transaction})
    let list = await Header.findAll({
      where: {height: {[$gte]: height - 500}},
      attributes: ['timestamp', 'bits'],
      order: [['height', 'ASC']],
      transaction: this.ctx.state.transaction
    })
    let interval = list[list.length - 1].timestamp - list[0].timestamp
    let sum = list.slice(1)
      .map(x => x.difficulty)
      .reduce((x, y) => x + y)
    return sum * 2 ** 32 * 16 / interval
  }

  async getFeeRates() {
    let client = new this.app.metrixinfo.rpc(this.app.config.metrixinfo.rpc)
    let results = await Promise.all([2, 4, 6, 10, 12, 24].map(blocks => client.estimatesmartfee(blocks)))
    return [
      {blocks: 2, feeRate: results[0].feerate || 10},
      {blocks: 4, feeRate: results[1].feerate || 10},
      {blocks: 6, feeRate: results[2].feerate || 10},
      {blocks: 10, feeRate: results[3].feerate || 10},
      {blocks: 12, feeRate: results[4].feerate || 10},
      {blocks: 24, feeRate: results[5].feerate || 10}
    ]
  }

  async getDGPInfo() {
    let client = new this.app.metrixinfo.rpc(this.app.config.metrixinfo.rpc)
    let info = await client.getdgpinfo()
    return {
      maxBlockSize: info.maxblocksize,
      minGasPrice: info.mingasprice,
      blockGasLimit: info.blockgaslimit,
      governanceCollateral: info.governancecollateral / 1e8,
      budgetFee: info.budgetfee / 1e8
    }
  }

  async getGovernorList() {
    let client = new this.app.metrixinfo.rpc(this.app.config.metrixinfo.rpc)
    let contractData = await client.callcontract("0000000000000000000000000000000000000089","883703c2")
    let chunks = contractData.executionResult.output.match(new RegExp('.{1,64}', 'g'));
    let governorList = [];
    let hexAddressList = [];
    for (let i = 2; i < chunks.length; i++) {
      let hexAddr = chunks[i].substring(24, 64);
      hexAddressList.push(hexAddr)
      if (!governorList[hexAddr]) {
          let addr = await client.fromhexaddress([hexAddr]);
          governorList[hexAddr] = addr
      }
    }

    // remove old governors
    Object.keys(governorList).forEach(hexAddr => {
        if (hexAddressList.indexOf(hexAddr) === -1) {
            delete governorList[hexAddr]
        }
    })

    let govs = Object.assign({},governorList);
    let count = Object.keys(governorList).length;

    return {
      governorCount: count,
      governorList: govs
    };
  }

  async getGovernorLockedCoins() {
    let client = new this.app.metrixinfo.rpc(this.app.config.metrixinfo.rpc)
    let contractData = await client.callcontract("0000000000000000000000000000000000000089","e8c9fd45")
    let dgpInfo = await this.getDGPInfo()
    let chunks = contractData.executionResult.output.match(new RegExp('.{1,64}', 'g'));
    let count = Number(U256(chunks[0], 16));
    let lockedGovernorSupply = Math.floor(dgpInfo.governanceCollateral) * count
    return lockedGovernorSupply
  }

  async getBlockChainInfo() {
    let client = new this.app.metrixinfo.rpc(this.app.config.metrixinfo.rpc)
    let info = await client.getblockchaininfo()
    return {
      moneysupply: info.moneysupply,
      difficulty: info.difficulty
    }
  }
}

module.exports = InfoService
