import * as MetrixinfoAPI from '@/services/metrixinfo-api'

class Contract {
  static get(id, options = {}) {
    return MetrixinfoAPI.get(`/contract/${id}`, options)
  }

  static getUtxo(id, options = {}) {
    return MetrixinfoAPI.get(`/contract/${id}/utxo`, options)
  }

  static getTransactions(id, {page, pageSize}, options = {}) {
    return MetrixinfoAPI.get(`/contract/${id}/txs`, {params: {page, pageSize}, ...options})
  }

  static listTokens({page, pageSize}, options = {}) {
    return MetrixinfoAPI.get(`/mrc20`, {params: {page, pageSize}, ...options})
  }

  static richList(id, {page, pageSize}, options = {}) {
    return MetrixinfoAPI.get(`/mrc20/${id}/rich-list`, {params: {page, pageSize}, ...options})
  }
}

export default Contract
