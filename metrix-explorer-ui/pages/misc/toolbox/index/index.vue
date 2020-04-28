<template>
  <Panel width="100%">
    <div class="padding">
    <table>
      <thead>
        <tr>
          <td>Address</td>
          <td>Balance</td>
          <td>-----</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
        </tr>
      </tbody>
    </table>
    </div>
  </Panel>
</template>
<script>
import Panel from "@/components/panel";
export default {
  components: {
    Panel
  }
};
</script>
<style lang="less" scoped>
@import url("../../../../styles/pages/misc/toolbar/star.less");
</style>