<template>
  <div class="container">
    <Panel width="100%" title="Staking Overview" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul>
            <li class="border">
              <div class="item-title">Block Height</div>
              <div class="item-info">{{ blockchain.height }}</div>
            </li>
            <li class="border">
              <div class="item-title">Total Supply</div>
              <div class="item-info">{{ supply }}</div>
            </li>
            <li class="border">
              <div class="item-title">Network weight</div>
              <div class="item-info">{{this.netStakeWeight | metrix(8)}}</div>
            </li>
            <li class="border">
              <div class="item-title">Difficulty</div>
              <div class="item-info">{{ difficulty }}</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li class="border">
              <div class="item-title">Annual ROI</div>
              <div
                class="item-info"
              >{{ (reward * 365 / this.netStakeWeight * 100).toFixed(2) }}%</div>
            </li>
            <li>
              <div class="item-title">Block Time</div>
              <div class="item-info">{{ blockInterval }}</div>
            </li>
            <li>
              <div class="item-title">Annual Inflation</div>
              <div class="item-info"></div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" title="Staking Rankings">
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
              <td>Rank</td>
              <td>Address</td>
              <td>Blocks Mined</td>
              <td>Percentage</td>
              <td>Balance</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in list">
              <td>{{index+1}}</td>
              <td>
                <nuxt-link :to="{name: 'address-id', params: {id: item.address}}">{{item.address}}</nuxt-link>
              </td>
              <td>{{item.blocks}}</td>
              
              <td v-if="item.blocks > blockchain.height - 5000">
                {{ ((item.blocks - 5000) / posBlocks * 100).toFixed(4) + '%' }}
              </td>
              <td v-else>
                {{ (item.blocks / posBlocks * 100).toFixed(4) + '%' }}
              </td>
              <td>{{ item.balance | metrix(8) }}</td>
            </tr>
          </tbody>
        </table>
        <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages"/>
      </Panel>
    </div>
  </div>
</template>
<script>
import Misc from "@/models/misc";
import Pagination from "@/components/pagination";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";
import Panel from "../../components/panel";
export default {
  components: { Panel, Pagination },
  head() {
    return {
      title: this.$t("misc.biggest_miners_title")
    };
  },
  data() {
    return {
      totalCount: 0,
      list: [],
      loading: !1,
      currentPage: Number(this.$route.query.page || 1),
      netStakeWeight: 0,
      difficulty: 0,
      supply: 0,
      blockInterval: 0
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect("/misc/biggest-miners");
      }
      let page = Number(query.page || 1);
      let { totalCount, list } = await Misc.biggestMiners(
        { from: (page - 1) * 100, to: page * 100 },
        { ip: req && req.ip }
      );
      let { netStakeWeight, blockchainInfo } = await Misc.info({ ip: req && req.ip });
      if (page > 1 && totalCount <= (page - 1) * 100) {
        redirect("/misc/biggest-miners", { page: Math.ceil(totalCount / 100) });
      }
      let difficulty = Math.round(blockchainInfo.difficulty).toLocaleString();
      let supply = Math.round(blockchainInfo.moneysupply).toLocaleString();

      let blockInterval24h = await Misc.blockInterval24h({ ip: req && req.ip });
      let blockInterval = parseFloat(blockInterval24h[0].blockInterval).toFixed(2);
      //console.log(list);
      return { totalCount, list, netStakeWeight, difficulty, supply, blockInterval};
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
    posBlocks() {
      return this.blockchain.height - 5000;
    },
    pages() {
      return Math.ceil(this.totalCount / 100);
    },
    reward() {
      let height = this.blockchain.height - 5001;
      let blocksPerYear = 350640;
      let rewardPercent = 10;
      if (height > 2 * 12 * blocksPerYear){
        rewardPercent /= 2
      }
      if (height > 4 * 12 * blocksPerYear){
        rewardPercent /= 2
      }
      if (height > 8 * 12 * blocksPerYear){
        rewardPercent /= 1
      }
      return rewardPercent;
    }
  },
  methods: {
    getLink(page) {
      return { name: "misc-biggest-miners", query: { page } };
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.loading = !0;
    let page = Number(to.query.page || 1);
    let { totalCount, list } = await Misc.biggestMiners({
      from: (page - 1) * 100,
      to: page * 100
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "misc-biggest-miners",
        query: { page: Math.ceil(totalCount / 100) }
      });
      return;
    }
    this.list = list;
    this.loading = !1;
    this.currentPage = page;
    next();
    scrollIntoView(this.$refs.section);
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/pages/misc/biggest-miners.less");
</style>