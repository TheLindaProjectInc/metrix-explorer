import * as MetrixinfoAPI from '@/services/metrixinfo-api'

class Misc {
  static info(options = {}) {
    return MetrixinfoAPI.get('/info', options)
  }

  static dailyTransactions(options = {}) {
    return MetrixinfoAPI.get('/stats/daily-transactions', options)
  }

  static blockInterval(options = {}) {
    return MetrixinfoAPI.get('/stats/block-interval', options)
  }

  static coinstake(options = {}) {
    return MetrixinfoAPI.get('/stats/coinstake', options)
  }

  static addressGrowth(options = {}) {
    return MetrixinfoAPI.get('/stats/address-growth', options)
  }

  static richList({from, to}, options = {}) {
    return MetrixinfoAPI.get(`/misc/rich-list`, {params: {page: from / (to - from), pageSize: to - from}, ...options})
  }

  static biggestMiners({from, to}, options = {}) {
    return MetrixinfoAPI.get(`/misc/biggest-miners`, {params: {page: from / (to - from), pageSize: to - from}, ...options})
  }
}

export default Misc
