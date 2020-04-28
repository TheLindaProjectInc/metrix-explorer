<template>
  <div class="container">
    <div class="notification">
      <i></i>
      <p>2020 METRIX ANNOUCEMENTS</p>
    </div>

    <Panel title="Network Overview" width="100%" height="355px" icon="icon-global" noMargin="true">
      <div class="detail">
        <div class="info">
          <span class="title">Network Status</span>
          <div class="frame">
            <div class="icon" v-for="(item,index) in icons">
              <div class="icons">
                <i :class="`icon-${item.img}`"></i>
              </div>
              <p :class="index === 0||index===4 ? 'word' :'word border'">{{item.describe}}</p>
              <p class="number">{{item.number}}</p>
            </div>
          </div>
        </div>
        <div class="info">
          <span class="title">Metrix Trasactions in the last 14 days</span>
          <div class="frame">
            <div class="chart" ref="daily-transactions"></div>
          </div>
        </div>
      </div>
    </Panel>

    <div class="block-deal">
      <Panel title="Block" width="590px" height="720px" icon="icon-block" link="/block">
        <table class="block-table">
          <thead>
            <tr>
              <td class="td-block">Block</td>
              <td class="td-address">Address</td>
              <td class="td-deal">TX Count</td>
              <td class="td-award">Block Reward</td>
              <td class="td-time">Time</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="block in recentBlocks">
              <td>
                <nuxt-link :to="{name: 'block-id', params: {id: block.height}}">{{block.height}}</nuxt-link>
              </td>
              <td>
                <nuxt-link
                  :to="{name: 'address-id', params: {id: block.miner}}"
                >{{block.miner | format(8,9)}}</nuxt-link>
              </td>
              <td>{{block.transactionCount}}</td>
              <td>{{block.reward | metrix(4) }}MRX</td>
              <td>
                <FromNow :timestamp="block.timestamp" />
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>
      <Panel title="Transactions" width="590px" height="720px" icon="icon-deal" link="/tx">
        <table class="deal-table">
          <thead>
            <tr>
              <td class="td-hash">TX ID</td>
              <td class="td-trade">Value</td>
              <td class="td-time">Time</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in recentTransactions" :key="transaction.id">
              <td>
                <nuxt-link
                  :to="{name: 'tx-id', params: {id: transaction.id}}"
                >{{transaction.id | format(10,15)}}</nuxt-link>
              </td>
              <td>{{ transaction.outputValue | metrix(4) }} MRX</td>
              <td>
                <FromNow :timestamp="transaction.timestamp" />
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>
    </div>
  </div>
</template>
<script>
import Panel from "../components/panel";
import Block from "@/models/block";
import Transaction from "@/models/transaction";
import Misc from "@/models/misc";
import { RequestError } from "@/services/metrixinfo-api";

export default {
  components: { Panel },
  head() {
    return {
      title: "metrix.info",
      titleTemplate: null
    };
  },
  data() {
    return {
      icons: [
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        },
        {
          img: "global",
          describe: "Daily Transactions",
          number: "6554"
        },
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        },
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        },
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        },
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        },
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        },
        {
          img: "global",
          describe: "Global Nodes",
          number: "6554"
        }
      ],
      recentBlocks: [],
      recentTransactions: [],
      netStakeWeight: 0,
      feeRate: 0,
      dailyTransactions: []
    };
  },
  async asyncData({ req, error }) {
    try {
      let [
        recentBlocks,
        recentTransactions,
        { netStakeWeight, feeRate },
        dailyTransactions
      ] = await Promise.all([
        Block.getRecentBlocks({ ip: req && req.ip }),
        Transaction.getRecentTransactions({ ip: req && req.ip }),
        Misc.info({ ip: req && req.ip }),
        Misc.dailyTransactions({ ip: req && req.ip })
      ]);
      return {
        recentBlocks,
        recentTransactions,
        netStakeWeight,
        feeRate,
        dailyTransactions
      };
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
    }
  },
  methods: {
    onMempoolTransaction(transaction) {
      this.recentTransactions.unshift(transaction);
      if (this.recentTransactions.length > 10) {
        this.recentTransactions.pop();
      }
    },
    onStakeWeight(stakeWeight) {
      this.netStakeWeight = stakeWeight;
    },
    onFeeRate(feeRate) {
      this.feeRate = feeRate;
    },
    async renderDailyTransactionsChart() {
      const [echarts] = await Promise.all([
        import("echarts/lib/echarts"),
        import("echarts/lib/chart/bar"),
        import("echarts/lib/chart/line"),
        import("echarts/lib/component/title"),
        import("echarts/lib/component/tooltip"),
        import("echarts/lib/component/dataZoom")
      ]);
      let chart = echarts.init(this.$refs["daily-transactions"]);
      chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            axis: "auto",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          top: "6%",
          left: 0,
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
              "13",
              "14"
            ]
          }
        ],
        yAxis: [
          {
            splitLine: { show: false },
            type: "value"
          }
        ],
        series: [
          {
            name: "Price",
            type: "line",
            stack: "Total",
            color: "#5197D5",
            showSymbol: false,
            label: {
              normal: {
                show: false,
                position: "top"
              }
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#5197D5"
                  },
                  {
                    offset: 1,
                    color: "#ffffff"
                  }
                ],
                global: false
              }
            },
            data: this.dailyTransactions
              .slice(-15, -1)
              .map(item => item.transactionCount)
          }
        ]
      });
    }
  },

  watch: {
    async "blockchain.height"(height) {
      console.log(height);
      if (height === this.recentBlocks[0].height + 1) {
        let block = await Block.get(height);
        this.recentBlocks.unshift({
          hash: block.hash,
          height: block.height,
          timestamp: block.timestamp,
          interval: block.interval,
          size: block.size,
          transactionCount: block.transactions.length,
          miner: block.miner,
          reward: block.reward
        });
        this.recentBlocks.pop();
      } else {
        this.recentBlocks = await Block.getRecentBlocks();
      }
    }
  },

  mounted() {
    this.renderDailyTransactionsChart();
    this._onMempoolTransaction = this.onMempoolTransaction.bind(this);
    this._onStakeWeight = this.onStakeWeight.bind(this);
    this._onFeeRate = this.onFeeRate.bind(this);

    this.$subscribe(
      "mempool",
      "mempool/transaction",
      this._onMempoolTransaction
    );
    this.$subscribe("blockchain", "stakeweight", this._onStakeWeight);
    this.$subscribe("blockchain", "feerate", this._onFeeRate);
  },
  beforeDestroy() {
    this.$unsubscribe(
      "mempool",
      "mempool/transaction",
      this._onMempoolTransaction
    );
    this.$unsubscribe("blockchain", "stakeweight", this._onStakeWeight);
    this.$unsubscribe("blockchain", "feerate", this._onFeeRate);
  }
};
</script>
<style lang="less" scoped>
@import url("../styles/pages/index.less");
</style>


