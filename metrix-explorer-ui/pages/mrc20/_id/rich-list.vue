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
        <tr v-for="(item,index) in list">
          <td>{{index+1}}</td>
          <td>
            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: item.address}}">{{item.address}}</nuxt-link>
          </td>
          <td>{{ item.balance | mrc20(mrc20.decimals) }} {{ mrc20.symbol }}</td>
          <td>{{ (Number(item.balance) / Number(mrc20.totalSupply) * 100).toFixed(4) + '%' }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
  </div>
</template>
<script>
import Vue from "vue";
import Contract from "@/models/contract";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";
import Pagination from "@/components/pagination";
export default {
  components: { Pagination },
  data() {
    return {
      totalCount: 0,
      list: [],
      currentPage: Number(this.$route.query.page || 1),
      loading: !1
    };
  },
  props: {
    mrc20: { required: true }
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect(`/contract/${params.id}/rich-list/`);
      }
      let page = Number(query.page || 1);
      let { totalCount, list } = await Contract.richList(
        params.id,
        { page: page - 1, pageSize: 100 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 100) {
        redirect(`/contract/${params.id}/rich-list/`, {
          page: Math.ceil(totalCount / 100)
        });
      }
      //console.log(list);
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
    id() {
      return this.$route.params.id;
    },
    pages() {
      return Math.ceil(this.totalCount / 100);
    }
  },
  methods: {
    getLink(page) {
      return {
        name: "contract-id-rich-list",
        params: { id: this.id },
        query: { page }
      };
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.loading = !0;
    let page = Number(to.query.page || 1);
    let { totalCount, list } = await Contract.richList(this.id, {
      page: page - 1,
      pageSize: 100
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "contract-id-rich-list",
        params: { id: this.id },
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
  scrollToTop: true
};
</script>

<style lang="less" scoped>
@import url("../../../styles/pages/mrc20/_id/rich-list.less");
</style>