<template>
  <div class="container">
    <Panel width="100%" title="Block List">
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
            <td>Height</td>
            <td>Time</td>
            <td>Number of Transactions</td>
            <td>Block Size</td>
            <td>Miner</td>
            <td>Block Reward</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{height, timestamp, size, reward, miner, transactionCount} of list">
            <td>
              <div class="frame">
                <nuxt-link class="metrix-link break-word monospace" :to="{name: 'block-id', params: {id: height }}">{{height}}</nuxt-link>
              </div>
            </td>
            <td>
              <FromNow :timestamp="timestamp" />
            </td>
            <td>{{ transactionCount}}</td>
            <td>{{ size.toLocaleString() }}</td>
            <td>
              <nuxt-link class="metrix-link break-word monospace" :to="{name: 'address-id', params: {id: miner}}">{{miner}}</nuxt-link>
            </td>
            <td>{{ reward | metrix(1) }}</td>
          </tr>
        </tbody>
      </table>
      <DatePagination :setdate="date" :submit="submit"/>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Block from "@/models/block";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";
import DatePagination from "@/components/date-pagination";

function formatUTCTimestamp(t) {
  return t.getUTCFullYear().toString() + "-" + (t.getUTCMonth() + 1).toString().padStart(2, "0") + "-" + t.getUTCDate().toString().padStart(2, "0")
}

export default {
  components: { Panel, DatePagination },
  head() {
    return {
      title: this.$t("block.list.block_list")
    };
  },
  data() {
    return {
      list: [],
      date: "",
      loading: !1
    };
  },
  async asyncData({ req, query, redirect, error }) {
    let d = query.date && new Date(query.date);
    try {
      let list = await Block.getBlocksByDate(d, {
        ip: req && req.ip
      });
      return { list, date: formatUTCTimestamp(d ? new Date(d) : new Date)};
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    blockchain() {
      return this.$store.state.blockchain;
    },
    today: function() {
      var t = new Date
        , e = t.getFullYear()
        , n = t.getMonth() + 1 < 10 ? "0".concat(t.getMonth() + 1) : t.getMonth() + 1
        , r = t.getDate() < 10 ? "0".concat(t.getDate()) : t.getDate();
        return "".concat(e, "-").concat(n, "-").concat(r)
    }
  },
  methods: {
    submit: function(e) {
      var t = new Date(e.target[0].value);
      this.$router.push({
        name: "block",
          query: {
            date: formatUTCTimestamp(t)
          }
      });
    },
    onBlock: function(t) {
      t.transactionCount = t.tx.length;
      var e = Date.parse(this.date + "T00:00:00") / 1e3;
      t.timestamp >= e && t.timestamp < e + 86400 && this.list.unshift(t)
    }
  },
  watch: {
    async "blockchain.height"(height) {
      if (height === this.list[0].height + 1) {
        let block = await Block.get(height);
        let todayTimestamp = Date.parse(this.date + "T00:00:00") / 1000;
        if (
          block.timestamp >= todayTimestamp &&
          block.timestamp < todayTimestamp + 60 * 60 * 24
        ) {
          this.list.unshift({
            hash: block.hash,
            height: block.height,
            timestamp: block.timestamp,
            interval: block.interval,
            size: block.size,
            transactionCount: block.transactions.length,
            miner: block.miner,
            reward: block.reward
          });
        }
      } else {
         this.list = await Block.getBlocksByDate(this.date);
      }
    }
  },
  async beforeRouteUpdate(to, from, next) { 
    this.loading = !0;
    let getDate = to.query.date && new Date(to.query.date);
    let list = await Block.getBlocksByDate(getDate);

    this.list = list;
    this.loading = !1;
    this.date = formatUTCTimestamp(getDate);
    next();
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/pages/block/index.less");
</style>
