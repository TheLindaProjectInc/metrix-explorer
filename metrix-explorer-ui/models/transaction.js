import * as MetrixinfoAPI from '@/services/metrixinfo-api'

class Transaction {
  static get(id, options = {}) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return MetrixinfoAPI.get('/txs/' + id.join(','), options)
      }
    } else {
      return MetrixinfoAPI.get(`/tx/${id}`, options)
    }
  }

  static getBrief(id, options = {}) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return MetrixinfoAPI.get('/txs/' + id.join(','), {params: {brief: ''}, ...options})
      }
    } else {
      return MetrixinfoAPI.get(`/tx/${id}`, {params: {brief: ''}, ...options})
    }
  }

  static getRecentTransactions(options = {}) {
    return MetrixinfoAPI.get('/recent-txs', options)
  }

  static getTxList(options = {}) {
    return MetrixinfoAPI.get('/tx/list', options)
  }

  static sendRawTransaction(data, options = {}) {
    return MetrixinfoAPI.post('/tx/send', {rawtx: data}, options)
  }
}

export default Transaction
