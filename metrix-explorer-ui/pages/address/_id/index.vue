<template>
  <div>
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
        <div class="item-income">Net Income</div>
        <div class="item-type">Type</div>
        <div class="item-confirmations">Confirmations</div>
      </div>
      <div class="table-body" v-for="item in transactions">
        <div class="table-body-item">
          <div class="item-id">
            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: item.id}}">{{item.id| format(10,10)}}</nuxt-link>
          </div>
          <div class="item-time" v-if="timetoggle">
            <FromNow :timestamp="item.timestamp" />
          </div>
          <div class="item-time" v-else>
            {{item.timestamp | timestamp}}
          </div>
          <div class="item-income">
            {{item.outputValue - item.inputValue | metrix(3)}}
          </div>
          <div class="item-type" v-if="item.isCoinbase">Coinbase</div>
          <div class="item-type" v-else-if="item.isCoinstake">Coinstake</div>
          <div class="item-type" v-else-if="item.inputs[0].address === '0000000000000000000000000000000000000090' || 
          item.inputs[0].address === '0000000000000000000000000000000000000089'">DGP Contract</div>
          <div class="item-type" v-else>MRX Transfer</div>
          <div class="item-confirmations">
            {{item.confirmations}}
          </div>
        </div>
      </div>
    </div>
    <pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
  </div>
</template>
<script>
import Vue from "vue";
import Pagination from "@/components/pagination";
import Address from "@/models/address";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/metrixinfo-api";
import { extendAddress } from "@/utils/address";
import { scrollIntoView } from "@/utils/dom";
export default {
  components: { Pagination },
  data() {
    return {
      totalCount: 0,
      transactions: [],
      loading: !1,
      currentPage: Number(this.$route.query.page || 1),
      timetoggle: !1
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect(`/address/${params.id}/`);
      }
      let page = Number(query.page || 1);
      let { totalCount, transactions } = await Address.getTransactions(
        params.id,
        { page: page - 1, pageSize: 20 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 20) {
        redirect(`/address/${params.id}/`, {
          page: Math.ceil(totalCount / 20)
        });
      }
      transactions = await Transaction.getBrief(transactions, {
        ip: req && req.ip
      });
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
    id() {
      return this.$route.params.id;
    },
    addresses() {
      let result = [];
      for (let address of this.id.split(",")) {
        if (!result.includes(address)) {
          result.push(address);
        }
      }
      return result;
    },
    pages() {
      return Math.ceil(this.totalCount / 20);
    }
  },
  methods: {
    getLink(page) {
      return { name: "address-id", params: { id: this.id }, query: { page } };
    },
    async onTransaction({ address, id }) {
      if (
        this.addresses.includes(address) &&
        this.transactions.every(item => item.id !== id)
      ) {
        this.transactions.unshift(await Transaction.getBrief(id));
      }
    },
    transactionChange(oldTransaction, newTransaction) {
      Vue.set(oldTransaction, "blockHeight", newTransaction.blockHeight);
      Vue.set(oldTransaction, "blockHash", newTransaction.blockHash);
      Vue.set(oldTransaction, "timestamp", newTransaction.timestamp);
      oldTransaction.outputs = newTransaction.outputs;
      oldTransaction.refundValue = newTransaction.refundValue;
      oldTransaction.fees = newTransaction.fees;
      oldTransaction.contractSpends = newTransaction.contractSpends;
      oldTransaction.mrc20TokenTransfers = newTransaction.mrc20TokenTransfers;
      oldTransaction.mrc721TokenTransfers = newTransaction.mrc721TokenTransfers;
    },
    subscribeAddress(address) {
      this.$subscribe(
        "address/" + address,
        "address/transaction",
        this._onTransaction
      );
    },
    unsubscribeAddress(address) {
      this.$unsubscribe(
        "address/" + address,
        "address/transaction",
        this._onTransaction
      );
    }
  },
  mounted() {
    this._onTransaction = this.onTransaction.bind(this);
    for (let address of this.addresses) {
      this.subscribeAddress(address);
    }
    this.$subscribedAddresses = this.addresses;
    console.log("transactions:", this.transactions);
  },
  beforeDestroy() {
    for (let address of this.$subscribedAddresses) {
      this.unsubscribeAddress(address);
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.loading = !0;
    for (let address of this.addresses) {
      this.unsubscribeAddress(address);
    }
    let page = Number(to.query.page || 1);
    let { totalCount, transactions } = await Address.getTransactions(this.id, {
      page: page - 1,
      pageSize: 20
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "address-id",
        params: { id: this.id },
        query: { page: Math.ceil(totalCount / 20) }
      });
      return;
    }
    this.transactions = await Transaction.getBrief(transactions);
    this.loading = !1;
    this.currentPage = page;
    next();
    for (let address of this.addresses) {
      this.subscribeAddress(address);
    }
    this.$subscribedAddresses = this.addresses;
    scrollIntoView(this.$refs["transaction-list"]);
  },
  scrollToTop: true
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/address/_id/index.less");
</style>
