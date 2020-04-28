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
          info: "Introduction",
          url: "/index"
        },
        {
          info: "Account",
          url: "/index"
        },
        {
          info: "Contract",
          url: "/index"
        },
        {
          info: "--",
          url: "/index"
        },
        {
          info: "Events",
          url: "/index"
        },
        {
          info: "Token",
          url: "/index"
        }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/misc/api/index.less");
</style>