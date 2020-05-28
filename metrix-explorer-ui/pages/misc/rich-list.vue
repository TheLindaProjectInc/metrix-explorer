<template>
  <Panel width="100%" title="Rich List">
    <table>
      <thead>
        <tr>
          <td>Rank</td>
          <td>Address</td>
          <td>Balance</td>
          <td>Percentage</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({address, balance}, index) of list">
          <td>{{ 100 * (currentPage - 1) + index + 1 }}</td>
          <td><nuxt-link :to="{name:'address-id',params:{id:address}}"> {{address}}</nuxt-link></td>
          <td>{{ balance | metrix(8) }}</td>
          <td>{{ (balance / totalSupply * 100).toFixed(4) + '%' }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages"/>
  </Panel>
</template>
<script>
import Panel from "@/components/panel";
import Pagination from '@/components/pagination'
import Misc from "@/models/misc";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";
export default {
  components: { Panel,Pagination },
  head() {
    return {
      title: this.$t("misc.rich_list_title")
    };
  },
  data() {
    return {
      totalCount: 0,
      list: [],
      currentPage: Number(this.$route.query.page || 1)
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect("/misc/rich-list");
      }
      let page = Number(query.page || 1);
      let { totalCount, list } = await Misc.richList(
        { from: (page - 1) * 100, to: page * 100 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 100) {
        redirect("/misc/rich-list", { page: Math.ceil(totalCount / 100) });
      }
      return { totalCount, list };
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
    totalSupply() {
      let height = this.blockchain.height;
      if (height <= 5000) {
        return height * 20000;
      }
      let supply = 1e16;
      let reward = 4e8;
      let interval = 985500;
      height -= 5000;
      let halvings = 0;
      while (halvings < 7 && height > interval) {
        supply += interval * (reward >>> halvings++);
        height -= interval;
      }
      return supply + height * (reward >>> halvings);
    },
    pages() {
      return Math.ceil(this.totalCount / 100);
    }
  },
  methods: {
    getLink(page) {
      return { name: "rich-list", query: { page } };
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../styles/pages/misc/rich-list.less");
</style>