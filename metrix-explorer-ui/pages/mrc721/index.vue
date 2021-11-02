<template>
  <div class="container">
    <Panel title="MRC721 List" width="100%" class="margin">
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>Symbol</td>
            <td>Total Supply</td>
            <td>Token Holders</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in tokens">
            <td>{{index+1}}</td>
            <td>
              <span class="token-name" :class="`token-${item.addressHex}`"></span>
              <nuxt-link class="mrx-link" :to="{name:'mrc721-id',params:{id:item.address}}">{{item.name}}</nuxt-link>
            </td>
            <td>{{item.symbol}}</td>
            <td>{{item.totalSupply }}</td>
            <td>{{item.holders}}</td>
          </tr>
        </tbody>
      </table>
      <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
    </Panel>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import Panel from "@/components/panel";
import MRC721 from "@/models/mrc721";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";

export default {
  components: { Panel, Pagination },
  head() {
    return {
      title: this.$t("contract.token.tokens")
    };
  },
  data() {
    return {
      totalCount: 0,
      tokens: [],
      loading: !1,
      currentPage: Number(this.$route.query.page || 1)
    };
  },
  async asyncData({ req, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect("/mrc721");
      }
      let page = Number(query.page || 1);
      let { totalCount, tokens } = await MRC721.listTokens(
        { page: page - 1, pageSize: 20 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 20) {
        redirect("/mrc721", { page: Math.ceil(totalCount / 20) });
      }
      return { totalCount, tokens };
    } catch (err) {
      if (err instanceof RequestError) {
        error({ statusCode: err.code, message: err.message });
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.totalCount / 20);
    }
  },
  methods: {
    getLink(page) {
      return { name: "contract-tokens", query: { page } };
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.loading = !0;
    let page = Number(to.query.page || 1);
    let { totalCount, tokens } = await MRC721.listTokens({
      page: page - 1,
      pageSize: 20
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "contract-tokens",
        query: { page: Math.ceil(totalCount / 20) }
      });
      return;
    }
    this.tokens = tokens;
    this.loading = !1;
    this.currentPage = page;
    next();
    scrollIntoView(this.$refs.section);
  }
};
</script>

<style lang="less" scoped>
@import url("../../styles/pages/mrc721/index.less");
</style>