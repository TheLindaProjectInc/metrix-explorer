<template>
  <div class="container">
    <Panel width="100%" title="Token Transaction List" class="margin">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>
              <div class="toggler" @click="timetoggle = !timetoggle">
                <div class="time">Time</div>
                <div class="icon">
                  <svg data-v-59a70ea1="" xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 20 18">
                    <path d="M12706,731.5a4.3,4.3,0,0,1-.7,2.449,5.3,5.3,0,0,1-1.9,1.79,5.411,5.411,0,0,1-2.6.658h-11.3l1.2,0.98a0.939,0.939,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-0.4.337a0.606,0.606,0,0,1-.5.215,1.021,1.021,0,0,1-.6-0.215l-3-2.847a0.776,0.776,0,0,1,0-1.04l3-2.847a1.013,1.013,0,0,1,.6-0.214,0.608,0.608,0,0,1,.5.214l0.4,0.337a0.936,0.936,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-1.2.979h11.3a3.017,3.017,0,0,0,2.2-.856,2.77,2.77,0,0,0,.9-2.082,4.511,4.511,0,0,0-.2-1.194,0.709,0.709,0,0,1-.1-0.444,0.6,0.6,0,0,1,.2-0.383l0.4-.367a0.776,0.776,0,0,1,.7-0.214,0.71,0.71,0,0,1,.5.4,4.347,4.347,0,0,1,.6,2.2h0Zm-17.7-1.806a0.709,0.709,0,0,1,.1.444,0.6,0.6,0,0,1-.2.382l-0.4.368a0.773,0.773,0,0,1-.7.214,0.71,0.71,0,0,1-.5-0.4,4.347,4.347,0,0,1-.6-2.2,4.3,4.3,0,0,1,.7-2.449,5.289,5.289,0,0,1,1.9-1.791,5.4,5.4,0,0,1,2.6-.658h11.3l-1.2-.98a0.972,0.972,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l0.4-.337a0.605,0.605,0,0,1,.5-0.214,0.833,0.833,0,0,1,.6.214l3,2.847a0.777,0.777,0,0,1,0,1.041l-3,2.847a1.02,1.02,0,0,1-.6.214,0.605,0.605,0,0,1-.5-0.214l-0.4-.337a0.975,0.975,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l1.2-.98h-11.3a3.018,3.018,0,0,0-2.2.857,2.771,2.771,0,0,0-.9,2.082,4.518,4.518,0,0,0,.2,1.194h0Zm0,0" transform="translate(-12686 -721)" class="cls-1">
                    </path>
                  </svg>
                </div>
              </div>
            </td>
            <td>Value</td>
            <td>Sender</td>
            <td>Receiver</td>
            <td>Confirmations</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx of transactions">
            <td>
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: tx.transactionId}}">{{tx.transactionId | format(10,10)}}</nuxt-link>
            </td>
            <td>
              <div class="item-time" v-if="timetoggle">
                <FromNow :timestamp="tx.timestamp" />
              </div>
              <div class="item-time" v-else>
                {{tx.timestamp | timestamp}}
              </div>
            </td>
            <td>
            {{ tx.value | mrc20(tx.token.decimals) }} 
            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: tx.token.address}}">{{tx.token.symbol}}</nuxt-link>
            </td>
            <td>
              <nuxt-link class="mrx-link break-word monospace" :to="{name: tx.fromHex ? 'contract-id' : 'address-id', params: {id: tx.from}}">{{tx.from | format(10,10)}}</nuxt-link>
            </td>
            <td>
              <nuxt-link class="mrx-link break-word monospace" :to="{name: tx.toHex ? 'contract-id' : 'address-id', params: {id: tx.to}}">{{tx.to | format(10,10)}}</nuxt-link>
            </td>
            <td>
            {{tx.confirmations + 1}}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="contractTx-table" v-for="tx of transactions">
        <div class="contractTx-id">
          <div class="content">
            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: tx.transactionId}}">{{tx.transactionId | format(15,15)}}</nuxt-link>
          </div>
        </div>
        <div class="contractTx-info" >
          <div class="contractTx-info-item">
            <div class="title">Time</div>
            <div class="content">{{tx.timestamp | timestamp}}</div>
          </div>
          <div class="contractTx-info-item">
            <div class="title">Value</div>
            <div class="content">
              {{tx.value | mrc20(tx.token.decimals) }} 
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: tx.token.address}}">{{tx.token.symbol}}</nuxt-link>
            </div>
          </div>
        </div>
        <div class="contractTx-info" >
          <div class="contractTx-info-item">
            <div class="title">Receiver</div>
            <div class="content">
              <nuxt-link class="mrx-link break-word monospace" :to="{name: tx.fromHex ? 'contract-id' : 'address-id', params: {id: tx.from}}">{{tx.from | format(10,10)}}</nuxt-link>
            </div>
          </div>
        </div>
        <div class="contractTx-info" >
          <div class="contractTx-info-item">
            <div class="title">Sender</div>
            <div class="content">
              <nuxt-link class="mrx-link break-word monospace" :to="{name: tx.toHex ? 'contract-id' : 'address-id', params: {id: tx.to}}">{{tx.to | format(10,10)}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
    </Panel>
  </div>
</template>

<script>
import Vue from "vue";
import Panel from "../../components/panel";
import Pagination from "@/components/pagination";
import { Responsive } from "@/plugins/mixins";
import Contract from "@/models/contract";
import Mrc20 from "@/models/mrc20";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";

export default {
  components: { Panel, Pagination},
  mixins: [Responsive],
    head() {
    return {
      title: this.$t("contract.transaction_list")
    };
  },
  data() {
    return {
      transactions: [],
      totalCount: 0,
      loading: !1,
      currentPage: Number(this.$route.query.page || 1),
      timetoggle: !1
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      query.page && !/^[1-9]\d*$/.test(query.page) && redirect("/mrc20/txs");
      let l = Number(query.page || 1);
      let { totalCount, transactions } = await Mrc20.getTxList({
        params: {
          limit: 20,
          offset: 20 * (l - 1)
        },
        ip: req && req.ip
      });
      if (l > 1 && totalCount <= (l - 1) * 20) {
        redirect("/mrc20/tx");
      }
      return { totalCount, transactions };
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
        getLink: function(t) {
          return {
              name: "/mrc20/tx",
              query: {
                  page: t
              }
          }
        },
        scrollToTop: function() {
          return this.$refs.section
        },
        onTransaction: function(t) {
          var n = t.totalCount
            , e = t.transactions;
          1 === this.currentPage && (this.totalCount = n,
          this.transactions = e)
        },
        subscribeTransactions: function() {
            this.$subscribe("address/" + this.id, "address/transaction", this._onTransaction),
            this.$subscribedAddress = this.id
        },
        unsubscribeTransactions: function() {
            this.$unsubscribe("address/" + this.id, "address/transaction", this._onTransaction)
        }
  },
  mounted(){
    this._onTransaction = this.onTransaction.bind(this),
    this.subscribeTransactions()
  },
  beforeDestroy() {
    this.unsubscribeTransactions()
  },
  async beforeRouteUpdate(to, from, next) { 
      this.loading = !0;
      let page = Number(to.query.page || 1);
      let { totalCount, transactions } = await Mrc20.getTxList({
        params: {
          limit: 20,
          offset: 20 * (page - 1)
        }
      });
      this.totalCount = totalCount;
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: "/mrc20/tx",
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


<style lang="less" scoped>
@import url("../../styles/pages/mrc721/deal_list.less");
</style>