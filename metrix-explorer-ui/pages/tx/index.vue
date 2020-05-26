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
      <table v-else>
        <thead>
          <tr>
            <td>ID</td>
            <td>Time</td>
            <td>Value</td>
            <td>Fee</td>
            <td>Type</td>
            <td>Confirmations</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{id, outputValue, fees, confirmations} of transactions">
            <td class="metrix-link break-word monospace">
              <nuxt-link :to="{name: 'tx-id', params: {id: id}}">{{id | format(15,6)}}</nuxt-link>
            </td>
            <td>

            </td>
            <td class="monospace">{{outputValue | metrix(4)}} MRX</td>
            <td class="monospace">{{fees | metrix(4)}}</td>
            <td></td>
            <td>{{confirmations}}</td>
          </tr>
        </tbody>
      </table>
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
      currentPage: Number(this.$route.query.page || 1)
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
