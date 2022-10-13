<template>
  <div class="container">
    <Panel class="panel-main margin" width="100%" title="Transaction List">
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
            <div class="mrx-link item-time" @click="timetoggle = !timetoggle">
              <div class="time">Time</div>
              <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 20 18">
                  <path d="M12706,731.5a4.3,4.3,0,0,1-.7,2.449,5.3,5.3,0,0,1-1.9,1.79,5.411,5.411,0,0,1-2.6.658h-11.3l1.2,0.98a0.939,0.939,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-0.4.337a0.606,0.606,0,0,1-.5.215,1.021,1.021,0,0,1-.6-0.215l-3-2.847a0.776,0.776,0,0,1,0-1.04l3-2.847a1.013,1.013,0,0,1,.6-0.214,0.608,0.608,0,0,1,.5.214l0.4,0.337a0.936,0.936,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-1.2.979h11.3a3.017,3.017,0,0,0,2.2-.856,2.77,2.77,0,0,0,.9-2.082,4.511,4.511,0,0,0-.2-1.194,0.709,0.709,0,0,1-.1-0.444,0.6,0.6,0,0,1,.2-0.383l0.4-.367a0.776,0.776,0,0,1,.7-0.214,0.71,0.71,0,0,1,.5.4,4.347,4.347,0,0,1,.6,2.2h0Zm-17.7-1.806a0.709,0.709,0,0,1,.1.444,0.6,0.6,0,0,1-.2.382l-0.4.368a0.773,0.773,0,0,1-.7.214,0.71,0.71,0,0,1-.5-0.4,4.347,4.347,0,0,1-.6-2.2,4.3,4.3,0,0,1,.7-2.449,5.289,5.289,0,0,1,1.9-1.791,5.4,5.4,0,0,1,2.6-.658h11.3l-1.2-.98a0.972,0.972,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l0.4-.337a0.605,0.605,0,0,1,.5-0.214,0.833,0.833,0,0,1,.6.214l3,2.847a0.777,0.777,0,0,1,0,1.041l-3,2.847a1.02,1.02,0,0,1-.6.214,0.605,0.605,0,0,1-.5-0.214l-0.4-.337a0.975,0.975,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l1.2-.98h-11.3a3.018,3.018,0,0,0-2.2.857,2.771,2.771,0,0,0-.9,2.082,4.518,4.518,0,0,0,.2,1.194h0Zm0,0" transform="translate(-12686 -721)" class="cls-1">
                  </path>
                </svg>
              </div>
            </div>
            <div class="item-value">Value</div>
            <div class="item-fee">Fee</div>
            <div class="item-type">Type</div>
            <div class="item-confirm">Confirmations</div>
        </div>
        <div class="table-body" v-for="tx of transactions">
          <div class="table-body-item">
            <div class="item-id">
              <div class="spread" @click="collapsed(tx.id)">
                <svg t="1589358527313" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4641" width="18" height="18" class="icon">
                  <path d="M821 563.2H566.2v254.9c0 28.1-22.8 51-51 51-28.1 0-51-22.8-51-51V563.2H209.4c-28.1 0-51-22.8-51-51 0-28.1 22.8-51 51-51h254.8V206.4c0-28.1 22.8-51 51-51s51 22.8 51 51v254.9H821c28.2 0 51 22.8 51 51 0 28.1-22.8 50.9-51 50.9z" p-id="4642" fill="#5197D5">
                  </path>
                </svg>
              </div>
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: tx.id}}">{{tx.id | format(10,10)}}</nuxt-link>
            </div>
            <div class="item-time" v-if="timetoggle">
              <FromNow :timestamp="tx.timestamp" />
            </div>
            <div class="item-time" v-else>
              {{tx.timestamp | timestamp}}
            </div>
            <div class="item-value" v-if="tx.mrc20TokenTransfers">
              <div v-for="mrc20 in tx.mrc20TokenTransfers">
                {{mrc20.value | mrc20(mrc20.decimals)}} 
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: mrc20.addressHex}}">{{mrc20.symbol}}</nuxt-link>
              </div>
            </div>
            <div class="item-value" v-else>
              {{tx.outputValue | metrix(4)}} MRX
            </div>
            <div class="item-fee">{{tx.fees | metrix(4)}}</div>
            <div class="item-type">{{ typeChecker(tx) }}</div>
            <div class="item-confirm">{{tx.confirmations}}</div>
          </div>
          <div class="mobile-body">
            <div class="item">
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: tx.id}}">{{tx.id | format(10,10)}}</nuxt-link>
            </div>
            <div class="item">
              <div class="title">Time</div>
              <div class="content">{{tx.timestamp | timestamp}}</div>
            </div>
            <div class="item">
              <div class="title">Value</div>
              <div class="content" v-if="tx.mrc20TokenTransfers">
                <div v-for="mrc20 in tx.mrc20TokenTransfers">
                  {{mrc20.value | mrc20(mrc20.decimals)}} 
                  <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: mrc20.addressHex}}">{{mrc20.symbol}}</nuxt-link>
                </div>
              </div>
              <div class="content" v-else>
                {{tx.outputValue | metrix(4)}} MRX
              </div>
            </div>
            <div class="item">
              <div class="title">Fee</div>
              <div class="content">{{tx.fees | metrix(4)}} MRX</div>
            </div>
            <div class="item">
              <div class="title">Type</div>
              <div class="content">{{ typeChecker(tx) }}</div>
            </div>
            <div class="item">
              <div class="title">Confirmations</div>
              <div class="content">{{tx.confirmations}}</div>
            </div>
            <div class="arrow-icon" @click="collapsed(tx.id)" >
              <svg :class="{down : opened.includes(tx.id)}" t="1589364875852" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5522" width="24" height="24" class="icon">
                <path d="M340.992 820.736c11.776 11.776 31.232 11.776 43.008 3.072l287.232-287.232c8.704-11.264 11.264-25.088 6.656-35.84-0.512-2.56-5.12-7.68-8.704-12.288L385.536 205.312c-11.776-14.848-30.72-14.848-42.496-3.072-11.776 11.776-11.776 30.72 0 42.496l265.216 268.288-267.264 264.192c-11.776 12.288-12.288 31.232 0 43.52z" fill="#5197D5" p-id="5523">
                </path>
              </svg>
            </div>
          </div>
          <div class="table-body-detail" v-if="opened.includes(tx.id)">
            <div class="transaction collapsed">
              <div class="detail tx-detail">
                <div class="utxo-list input-list">
                  <div class="summary-item">
                    Inputs ({{ tx.inputs.length }})&nbsp;
                    <span class="monospace">{{tx.inputValue | metrix(8)}} MRX</span>
                  </div>
                  <div class="utxo" v-for="input in tx.inputs">
                    <div class="is-pulled-left">
                      <div class="utxo-address">
                        <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: input.address}}">{{input.address}}</nuxt-link>
                      </div>
                    </div>
                    <div class="is-pulled-right">
                      <div class="utxo-value monospace">
                        <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: tx.id}}">{{input.value | metrix(8)}}</nuxt-link>
                        <span class="symbol">MRX</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="utxo-list">
                  <div class="summary-item">
                    Outputs ({{ tx.outputs.length }})&nbsp;
                    <span class="monospace">{{tx.outputValue | metrix(8)}} MRX</span>
                  </div>
                  <div class="utxo" v-for="output in tx.outputs">
                    <div class="is-pulled-left">
                      <div class="utxo-address">
                        <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: output.address}}">{{output.address}}</nuxt-link>
                      </div>
                    </div>
                    <div class="is-pulled-right">
                      <div class="utxo monospace">
                        {{output.value | metrix(8)}} MRX
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail gasrefund" v-if="tx.refundValue > 0">
                <div class="utxo-list">
                  <div class="utxo">
                    <div class="is-pulled-left">
                      <div class="utxo-address">Gas refund</div>
                    </div>
                  </div>
                </div>
                <div class="utxo-list">
                  <div class="utxo">
                    <div class="is-pulled-left">
                      <div class="utxo-address">
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: tx.inputs[0].address}}">{{ tx.inputs[0].address }}</nuxt-link>
                      </div>
                    </div>
                    <div class="is-pulled-right">
                      <div class="utxo-value monospace">
                        {{tx.refundValue | metrix(8)}} MRX
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail mrc-detail" v-if="tx.mrc20TokenTransfers" v-for="mrc20 in tx.mrc20TokenTransfers">
                <div class="utxo-list input-list">
                  <div class="utxo">
                    <div class="is-pulled-left">
                      <div v-if="mrc20.from !== null" class="utxo-address">
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc20.from }}">{{ mrc20.from }}</nuxt-link>
                      </div>
                      <div v-if="mrc20.from === null" class="utxo-address">
                        Mint
                      </div>
                    </div>
                  </div>
                </div>
                <div class="utxo-list">
                  <div class="utxo">
                    <div class="is-pulled-left">
                      <div v-if="mrc20.to !== null" class="utxo-address">
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc20.to }}">{{ mrc20.to }}</nuxt-link>
                      </div>
                      <div v-if="mrc20.to === null" class="utxo-address">
                        Burn
                      </div>
                    </div>
                    <div class="is-pulled-right">
                      <div class="utxo-value monospace">
                        {{mrc20.value | mrc20(mrc20.decimals) }} 
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'mrc20-id', params: {id: mrc20.address }}">{{ mrc20.symbol }}</nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail mrc-detail" v-if="tx.mrc721TokenTransfers" v-for="mrc721 in tx.mrc721TokenTransfers">
                <div class="utxo-list input-list">
                  <div class="utxo">
                    <div class="is-pulled-left">
                      <div v-if="mrc721.from !== null" class="utxo-address">
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc721.from }}">{{ mrc721.from }}</nuxt-link>
                      </div>
                      <div v-if="mrc721.from === null" class="utxo-address">
                        Mint
                      </div>
                    </div>
                  </div>
                </div>
                <div class="utxo-list">
                  <div class="utxo">
                    <div class="is-pulled-left">
                      <div v-if="mrc721.to !== null" class="utxo-address">
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc721.to }}">{{ mrc721.to }}</nuxt-link>
                      </div>
                      <div v-if="mrc721.to === null" class="utxo-address">
                        Burn
                      </div>
                    </div>
                    <div class="is-pulled-right">
                      <div class="utxo-value monospace">
                        {{mrc721.tokenId }} 
                        <nuxt-link class="mrx-link break-work monospace" :to="{name: 'mrc20-id', params: {id: mrc721.address }}">{{ mrc721.symbol }}</nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages"/>
    </Panel>
  </div>
</template>
<script>
import Vue from "vue";
import Panel from "../../components/panel";
import Pagination from "@/components/pagination";
import { Responsive } from "@/plugins/mixins";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";
export default {
  components: { Panel, Pagination },
  mixins: [Responsive],
  head() {
    return {
      title: this.$t("transaction.list")
    };
  },
  data() {
    return {
      transactions: [],
      totalCount: 0,
      loading: !1,
      currentPage: Number(this.$route.query.page || 1),
      timetoggle: !1,
      opened: []
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      query.page && !/^[1-9]\d*$/.test(query.page) && redirect("/tx");
      let l = Number(query.page || 1);
      let { transactions, totalCount } = await Transaction.getTxList({
        params: {
          limit: 20,
          offset: 20 * (l - 1)
        },
        ip: req && req.ip
      });
      if (l > 1 && totalCount <= (l - 1) * 20) {
        redirect("/tx");
      }
      return { transactions, totalCount };
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    pages: function() {
        return Math.ceil(this.totalCount / 20)
    }
  },
  methods: {
        typeChecker(transaction){
          let type = "";

          if (transaction.isCoinbase) { type = "Coinbase" }
          else if (transaction.isCoinstake) { type = "Coinstake" }
          else if (transaction.inputs[0].address === '0000000000000000000000000000000000000090' || 
              transaction.inputs[0].address === '0000000000000000000000000000000000000089' ||
              transaction.inputs[0].address === 'b196971bc9ed1a193fa69310986d3de5d14c59c4' ||
              transaction.inputs[0].address === '4e3d35f867c895c612d38dc28a30e815c6ccd717') { type = "DGP Contract" }
          else if (transaction.mrc20TokenTransfers) { type = "MRC20 Token Transfer" }
          else if (transaction.mrc721TokenTransfers) { type = "MRC721 Token Transfer" }
          else {
            type = "MRX Transfer";
          }

          return type;
        },
        getLink: function(t) {
          return {
              name: "tx",
              query: {
                  page: t
              }
          }
        },
        scrollToTop: function() {
          return this.$refs.section
        },
        onLatestTransactions: function(t) {
          var n = t.totalCount
            , e = t.transactions;
          1 === this.currentPage && (this.totalCount = n,
          this.transactions = e)
        },
        onMempoolTransaction: function(t) {
          1 === this.currentPage && (++this.totalCount,
          this.transactions.unshift(t))
        },
        collapsed(id) {
          const index = this.opened.indexOf(id);
          if (index > -1) {
            this.opened.splice(index,1)
          } else {
            this.opened.push(id)
          }
        }
  },
  mounted(){
      this._onLatestTransactions = this.onLatestTransactions.bind(this),
      this._onMempoolTransaction = this.onMempoolTransaction.bind(this),
      this.$subscribe("transaction", "latest-transactions", this._onLatestTransactions),
      this.$subscribe("mempool", "mempool/transaction", this._onMempoolTransaction)
  },
  beforeDestroy() {
      this.$unsubscribe("transaction", "latest-transactions", this._onLatestTransactions),
      this.$unsubscribe("mempool", "mempool/transaction", this._onMempoolTransaction)
  },
  async beforeRouteUpdate(to, from, next) { 
      this.loading = !0;
      let page = Number(to.query.page || 1);
      let { totalCount, transactions } = await Transaction.getTxList({
        params: {
          limit: 20,
          offset: 20 * (page - 1)
        }
      });
      this.totalCount = totalCount;
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: "tx",
          query: { page: Math.ceil(totalCount / 20) }
        });
        return;
      }
      this.loading = !1;
      this.transactions = transactions;
      this.currentPage = page;
      next();
      scrollIntoView(this.$refs.list);
  },
  scrollToTop: true
};
</script>
<style lang='less' scoped>
@import url("../../styles/pages/tx/index.less");
</style>
