<template>
  <table>
    <thead>
      <tr>
        <td>ID</td>
        <td>Time</td>
        <td>Token</td>
        <td></td>
        <td>Fee(MRX)</td>
        <td>Confirmations</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in transactions">
        <td>
          <nuxt-link :to="{name: 'tx-id', params: {id: item.id}}">{{item.id| format(10,10)}}</nuxt-link>
        </td>
        <td>
          <FromNow :timestamp="item.timestamp" />
        </td>
        <td>{{mrc20.symbol}}</td>
        <td></td>
        <td>{{item.fees | metrix(3)}}</td>
        <td>{{item.confirmations}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Vue from "vue";
import Contract from "@/models/contract";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";

export default {
  data() {
    return {
      totalCount: 0,
      transactions: [],
      currentPage: Number(this.$route.query.page || 1)
    };
  },
  props: {
    mrc20: { required: true }
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect(`/contract/${params.id}/`);
      }
      let page = Number(query.page || 1);
      let { totalCount, transactions } = await Contract.getTransactions(
        params.id,
        { page: page - 1, pageSize: 20 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 20) {
        redirect(`/contract/${params.id}/`, {
          page: Math.ceil(totalCount / 20)
        });
      }
      transactions = await Transaction.getBrief(transactions, {
        ip: req && req.ip
      });
      return {
        totalCount,
        transactions
      };
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 404) {
          error({ statusCode: 404, message: `Contract ${param.id} not found` });
        } else {
          error({ statusCode: err.code, message: err.message });
        }
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    pages() {
      return Math.ceil(this.totalCount / 20);
    }
  },
  methods: {
    getLink(page) {
      return { name: "contract-id", params: { id: this.id }, query: { page } };
    },
    async onTransaction({ id, address }) {
      if (
        address === this.id &&
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
    subscribeTransactions() {
      this.$subscribe(
        "address/" + this.id,
        "address/transaction",
        this._onTransaction
      );
      this.$subscribedAddress = this.id;
    },
    unsubscribeTransactions() {
      this.$unsubscribe(
        "address/" + this.id,
        "address/transaction",
        this._onTransaction
      );
    }
  },
  mounted() {
    this._onTransaction = this.onTransaction.bind(this);
    this.subscribeTransactions();
  },
  beforeDestroy() {
    this.unsubscribeTransactions();
  },
  async beforeRouteUpdate(to, from, next) {
    this.unsubscribeTransactions();
    let page = Number(to.query.page || 1);
    let { totalCount, transactions } = await Contract.getTransactions(this.id, {
      page: page - 1,
      pageSize: 20
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "contract-id",
        params: { id: this.id },
        query: { page: Math.ceil(totalCount / 20) }
      });
      return;
    }
    this.transactions = await Transaction.getBrief(transactions);
    this.currentPage = page;
    next();
    this.subscribeTransactions();
    scrollIntoView(this.$refs["transaction-list"]);
  },
  scrollToTop: true
};
</script>

<style lang="less" scoped>
@import url("../../../styles/pages/contract/_id/index.less");
</style>