<template>
  <div class="pagination">
    <div class="pagination-wrapper">
      <button class="prev" @click="prePage" :disabled="isInFirstPage">Previous page</button>
      <input ref="input" class="current" v-model="inputValue" v-on:keyup.enter="submit"/>
      <button class="next" @click="nextPage" :disabled="isInLastPage">Next page</button>
      <span class="total">Total {{ pages }} pages</span>
    </div>
  </div>
</template>

<script>
import { Responsive } from "@/plugins/mixins";

export default {
  mixins: [Responsive],
  data() {
    return {
      inputValue: 1
    };
  },
  props: {
    pages: {
        type: Number,
        required: !0
    },
    currentPage: {
        type: Number,
        required: !0
    },
    getLink: {
        type: Function,
        required: !0
    },
    scroll: {
        type: Function,
        required: !1
    }
  },
  computed: {
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      return this.currentPage === this.pages;
    }
  },
  methods: {
    submit: function() {
        this.inputValue <= this.pages && this.inputValue > 0 && (this.scrollHandle(),
        this.$router.push(this.getLink(this.inputValue)))
    },
    nextPage: function() {
        this.scrollHandle(),
        this.currentPage < this.pages && this.$router.push(this.getLink(this.currentPage + 1))
    },
    prePage: function() {
        this.scrollHandle(),
        this.currentPage > 1 && this.$router.push(this.getLink(this.currentPage - 1))
    },
    scrollHandle: function() {
        this.scroll && Object(kt.a)(this.scroll())
    }
  },
  mounted: function() {
      this.inputValue = this.currentPage
  },
  watch: {
    currentPage() {
      this.inputValue = this.currentPage;
      this.$refs.input.blur();
    },
    inputValue: function(t) {
        var e = String(t).replace(/\D/g, "");
        e !== this.inputValue && (this.inputValue = e)
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../styles/components/pagination.less');
</style>
