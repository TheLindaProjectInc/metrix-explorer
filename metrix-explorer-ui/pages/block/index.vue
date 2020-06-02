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
      <div v-else class="block-wrapper">
        <table>
          <thead>
            <tr>
              <td>Height</td>
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
                  <nuxt-link class="mrx-link break-word monospace" :to="{name: 'block-id', params: {id: height }}">{{height}}</nuxt-link>
                </div>
              </td>
              <td v-if="timetoggle">
                <FromNow :timestamp="timestamp" />
              </td>
              <td v-else>
                {{timestamp | timestamp}}
              </td>
              <td>{{ transactionCount}}</td>
              <td>{{ size.toLocaleString() }}</td>
              <td>
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: miner}}">{{miner}}</nuxt-link>
              </td>
              <td>{{ reward | metrix(1) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="block-table" v-for="{height, timestamp, size, reward, miner, transactionCount} of list">
          <div class="block-id">
            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'block-id', params: {id: height }}">{{height}}</nuxt-link>
          </div>
          <div class="block-content">
            <div class="block-miner">
              <span class="title">Miner</span>
              <span class="info">
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: miner}}">{{miner | format(8,8)}}</nuxt-link>
              </span>
            </div>
            <div class="block-info">
              <div class="block-info-item">
                <div class="title">Time</div>
                <div class="content">{{timestamp | timestamp}}</div>
              </div>
              <div class="block-info-item">
                <div class="title">TX Count</div>
                <div class="content">{{ transactionCount }}</div>
              </div>
            </div>
            <div class="block-info">
              <div class="block-info-item">
                <div class="title">Size</div>
                <div class="content">{{ size.toLocaleString() }}</div>
              </div>
              <div class="block-info-item">
                <div class="title">Reward</div>
                <div class="content">{{ reward | metrix(3) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      loading: !1,
      timetoggle: !1
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
