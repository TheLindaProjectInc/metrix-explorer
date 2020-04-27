import metrixinfoAPI from '@/services/metrixinfo-api'
import {getLocale} from '@/plugins/i18n'

export const actions = {
  async nuxtServerInit({commit}, {req}) {
    let {data} = await metrixinfoAPI.get('/info', {headers: {'X-Forwarded-For': req.ip}})
    commit('blockchain/height', data.height)
    commit('locale/language', getLocale(req))
  }
}
