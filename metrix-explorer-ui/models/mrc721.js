import * as MetrixinfoAPI from '@/services/metrixinfo-api'

class MRC721 {

  static listTokens({page, pageSize}, options = {}) {
    return MetrixinfoAPI.get(`/mrc721`, {params: {page, pageSize}, ...options})
  }

}

export default MRC721
