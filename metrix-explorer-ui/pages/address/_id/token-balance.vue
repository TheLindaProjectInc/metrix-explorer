<template>
  <div>
    <div ref="list" v-if="transactions.length > 0">
      <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      <div class="animation" v-if="loading">
        <div class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="table" v-else>
        <div class="table-title">
          <div class="item-id">ID</div>
          <div class="item-time">
            <div class="toggler" @click="timetoggle = !timetoggle">
              <div class="time">Time</div>
              <div class="icon">
                <svg data-v-59a70ea1="" xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 20 18">
                  <path d="M12706,731.5a4.3,4.3,0,0,1-.7,2.449,5.3,5.3,0,0,1-1.9,1.79,5.411,5.411,0,0,1-2.6.658h-11.3l1.2,0.98a0.939,0.939,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-0.4.337a0.606,0.606,0,0,1-.5.215,1.021,1.021,0,0,1-.6-0.215l-3-2.847a0.776,0.776,0,0,1,0-1.04l3-2.847a1.013,1.013,0,0,1,.6-0.214,0.608,0.608,0,0,1,.5.214l0.4,0.337a0.936,0.936,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-1.2.979h11.3a3.017,3.017,0,0,0,2.2-.856,2.77,2.77,0,0,0,.9-2.082,4.511,4.511,0,0,0-.2-1.194,0.709,0.709,0,0,1-.1-0.444,0.6,0.6,0,0,1,.2-0.383l0.4-.367a0.776,0.776,0,0,1,.7-0.214,0.71,0.71,0,0,1,.5.4,4.347,4.347,0,0,1,.6,2.2h0Zm-17.7-1.806a0.709,0.709,0,0,1,.1.444,0.6,0.6,0,0,1-.2.382l-0.4.368a0.773,0.773,0,0,1-.7.214,0.71,0.71,0,0,1-.5-0.4,4.347,4.347,0,0,1-.6-2.2,4.3,4.3,0,0,1,.7-2.449,5.289,5.289,0,0,1,1.9-1.791,5.4,5.4,0,0,1,2.6-.658h11.3l-1.2-.98a0.972,0.972,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l0.4-.337a0.605,0.605,0,0,1,.5-0.214,0.833,0.833,0,0,1,.6.214l3,2.847a0.777,0.777,0,0,1,0,1.041l-3,2.847a1.02,1.02,0,0,1-.6.214,0.605,0.605,0,0,1-.5-0.214l-0.4-.337a0.975,0.975,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l1.2-.98h-11.3a3.018,3.018,0,0,0-2.2.857,2.771,2.771,0,0,0-.9,2.082,4.518,4.518,0,0,0,.2,1.194h0Zm0,0" transform="translate(-12686 -721)" class="cls-1">
                  </path>
                </svg>
              </div>
            </div>
          </div>
          <div class="item-balance">Current Balance</div>
          <div class="item-balance-change">Balance Change</div>
        </div>
        <div class="table-body">
          <div v-for="{id, timestamp, tokens} in transactions">
            <div class="table-body-item">
              <div class="item-id">
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: id}}">{{id | format(15,15)}}</nuxt-link>
              </div>
              <div class="item-time" v-if="timetoggle">
                <FromNow :timestamp="timestamp" />
              </div>
              <div class="item-time" v-else>
                {{timestamp | timestamp}}
              </div>
              <div class="item-balance" v-for="{addressHex, name, symbol, decimals, balance} in tokens">
                {{ balance.replace('-', '') | mrc20(decimals) }}
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: addressHex}}">{{symbol}}</nuxt-link>
              </div>
              <div class="item-balance-change" v-for="{addressHex, name, symbol, decimals, amount} in tokens">
                  <span v-if="amount > 0">+</span>
                  <span v-else-if="amount < 0">-</span>
                  <span v-else>&nbsp;</span>
                  {{ amount.replace('-', '') | mrc20(decimals) }}
                  <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: addressHex}}">{{symbol}}</nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="mobile-body" v-for="{id, timestamp, tokens} in transactions">
          <div class="item">
            <div class="title">ID</div>
            <div class="content">
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: id}}">{{id | format(15,15)}}</nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="title">Time</div>
            <div class="content">
              {{timestamp | timestamp}}
            </div>
          </div>
          <div class="item">
            <div class="title">Current Balance</div>
            <div class="content" v-for="{addressHex, name, symbol, decimals, balance} in tokens">
              {{ balance.replace('-', '') | mrc20(decimals) }}
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: addressHex}}">{{symbol}}</nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="title">Balance Change
            </div>
            <div class="content" v-for="{addressHex, name, symbol, decimals, amount} in tokens">
              <span v-if="amount > 0">+</span>
              <span v-else-if="amount < 0">-</span>
              <span v-else>&nbsp;</span>
              {{ amount.replace('-', '') | mrc20(decimals) }}
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: addressHex}}">{{symbol}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
    </div>
    <div class="nodata" v-else>
      <div class="nodata-img" />
      <p class="nodata-info">No Data</p>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Responsive} from '@/plugins/mixins'
  import Address from '@/models/address'
  import {RequestError} from '@/services/metrixinfo-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    mixins: [Responsive],
    data() {
      return {
        totalCount: 0,
        transactions: [],
        loading: !1,
        currentPage: Number(this.$route.query.page || 1),
        selectedToken: '',
        timetoggle: !1
      }
    },
    async asyncData({req, params, query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}/token-balance`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getTokenBalanceTransactions(
          params.id,
          {page: page - 1, pageSize: 100, tokens: query.token},
          {ip: req && req.ip}
        )
        if (page > 1 && totalCount <= (page - 1) * 100) {
          redirect(`/address/${params.id}/token-balance`, {page: Math.ceil(totalCount / 100)})
        }
        return {totalCount, transactions, ...(query.token ? {selectedtoken: query.token.split(',')} : {})}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          error({statusCode: 500, message: err.message})
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      pages() {
        return Math.ceil(this.totalCount / 100)
      }
    },
    methods: {
      getLink(page) {
        return {
          name: 'address-id-token-balance',
          params: {id: this.id},
          query: {
            page,
            ...this.selectedToken ? {token: this.selectedToken} : {}
          }
        }
      }
    },
    async beforeRouteUpdate(to, from, next) {
      this.loading = !0;
      let page = Number(to.query.page || 1)
      let token = to.query.token
      let {totalCount, transactions} = await Address.getTokenBalanceTransactions(
        this.id,
        {page: page - 1, pageIndex: 100, token}
      )
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'address-id-token-balance',
          params: {id: this.id},
          query: {page: Math.ceil(totalCount / 100), ...(token ? {token} : {})}
        })
        return
      }
      this.transactions = transactions;
      this.loading = !1;
      this.currentPage = page;
      if (!token) {
        this.selectedToken = ''
      }
      next()
      scrollIntoView(this.$refs.list)
    },
    scrollToTop: true
  }
</script>

<style lang="less" scoped>
@import url("../../../styles/pages/address/_id/token-balance.less");
</style>
