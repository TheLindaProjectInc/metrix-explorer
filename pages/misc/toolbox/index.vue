<template>
  <div class="flex">
    <Aside :list="itemlist"></Aside>
    <section>
      <nuxt-child></nuxt-child>
    </section>
  </div>
</template>
<script>
import Aside from "@/components/aside";
export default {
  components: {
    Aside
  },
  data() {
    return {
      itemlist: [
        {
          info: "Subscriptions",
          url: ""
        },
        {
          info: "Stake Calculator",
          url: "stake-calculator"
        },
        {
          info: "Feedback",
          url: "feedback"
        }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/misc/toolbar/index.less");
</style>