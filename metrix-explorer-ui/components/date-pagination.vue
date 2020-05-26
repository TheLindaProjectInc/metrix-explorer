<template>
  <form action="/block" method="GET" class="date-pagination" v-on:submit="function(e) {
      return e.preventDefault(),
      submit(e)}" >
    <div class="date-pagination-wrapper" >
      <input ref="input" type="date" name="date" v-model="date" class="date-pagination-input" min="2020-04-17" max="today" />
      <button class="date-pagination-button" type="submit" >Go</button>
    </div>
  </form>
</template>

<script>
import { Responsive } from "@/plugins/mixins";

export default {
  mixins: [Responsive],
  data() {
    return {
      date: ""
    };
  },
  props:{
    submit: {
      type: Function,
      required: !0
    },
    setdate: {
      type: String,
      default: ""
    }
  },
  computed: {
    today: function() {
        var t = new Date
          , e = t.getFullYear()
          , n = t.getMonth() + 1 < 10 ? "0".concat(t.getMonth() + 1) : t.getMonth() + 1
          , r = t.getDate() < 10 ? "0".concat(t.getDate()) : t.getDate();
        return "".concat(e, "-").concat(n, "-").concat(r)
    }
  },
  mounted: function() {
    if (this.date === "") {
      this.date = this.setdate;
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../styles/components/date-pagination.less');
</style>
