import * as MetrixinfoAPI from '@/services/metrixinfo-api'

class MRC20 {

  static getTxList(options = {}) {
    return MetrixinfoAPI.get('/mrc20/txs', options)
  }

  static getTransactions(id, {page, pageSize}, options = {}) {
    return MetrixinfoAPI.get(`/mrc20/${id}/txs`, {params: {page, pageSize}, ...options})
  }
}

export default MRC20
