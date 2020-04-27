<template>
  <div class="container">
    <Panel width="100%" title="Token">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Time</td>
            <td>Amount</td>
            <td>Fee</td>
            <td>Confirmations</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Panel>
  </div>
</template>

<script>
import Vue from "vue";
import Panel from "../../components/panel";
import Contract from "@/models/contract";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/metrixinfo-api";
import { scrollIntoView } from "@/utils/dom";

export default {
  components: { Panel }
};
</script>


<style lang="less" scoped>
@import url("../../styles/pages/contract/deal_list.less");
</style>