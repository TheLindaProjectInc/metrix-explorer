import * as MetrixinfoAPI from '@/services/metrixinfo-api'

class MRC20 {

  static getTxList(options = {}) {
    return MetrixinfoAPI.get('/mrc20/txs', options)
  }

}

export default MRC20
