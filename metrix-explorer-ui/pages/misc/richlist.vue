<template>
  <Panel width="100%" title="Rich List" class="margin">
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
          <td>Balance</td>
          <td>Percentage</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({address, balance}, index) of list">
          <td>{{ 100 * (currentPage - 1) + index + 1 }}</td>
          <td><nuxt-link class="mrx-link break-word monospace" :to="{name:'address-id',params:{id:address}}"> {{address}}</nuxt-link></td>
          <td>{{ balance | metrix(8) }}</td>
          <td>{{ (balance / totalSupply * 100).toFixed(4) + '%' }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
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
      info: [],
      currentPage: Number(this.$route.query.page || 1),
      loading: !1
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect("/misc/rich-list");
      }
      let page = Number(query.page || 1);
      let { totalCount, list } = await Misc.richList(
        { from: (page - 1) * 100, to: page * 100 }
      );
      if (page > 1 && totalCount <= (page - 1) * 100) {
        redirect("/misc/rich-list", { page: Math.ceil(totalCount / 100) });
      }
      let info = await Misc.info({ ip: req && req.ip });
      return { totalCount, list, info};
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
      let supply = this.info.blockchainInfo.moneysupply * 1e8;
      return supply;
    },
    pages() {
      return Math.ceil(this.totalCount / 100);
    }
  },
  methods: {
    getLink(t) {
      return { 
        name: "misc-richlist", 
        query: { 
          page: t
        } 
      };
    },
    scrollToTop: function() {
      return this.$refs.section
    }
  },
  async beforeRouteUpdate(to, from, next) { 
      this.loading = !0;
      let page = Number(to.query.page || 1);
      let { totalCount, list } = await Misc.richList(
        { from: (page - 1) * 100, to: page * 100 }
      );
      this.totalCount = totalCount;
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: "misc-richlist",
          query: { page: Math.ceil(totalCount / 100) }
        });
        return;
      }
      this.loading = !1;
      this.list = list;
      this.currentPage = page;
      next();
      scrollIntoView(this.$refs.list);
  },
};
</script>
<style lang="less" scoped>
@import url("../../styles/pages/misc/richlist.less");
</style>