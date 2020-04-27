<template>
  <div class="container">
    <Panel :title="this.title" width="100%" noMargin="true">
      <div class="address-info">
        <div class="address-info-left list">
          <ul>
            <li>
              <div class="item-title">Token Name</div>
              <div class="item-info">{{ mrc20.name }}</div>
            </li>
            <li class="border">
              <div class="item-title">Total Supply</div>
              <div class="item-info">
                {{ mrc20.totalSupply | mrc20(mrc20.decimals, true) }}
                {{ mrc20.symbol || $t('contract.token.tokens') }}
              </div>
            </li>
            <li class="border">
              <div class="item-title">Contract Address</div>
              <div class="item-info">{{addressHex}}</div>
            </li>
            <li>
              <div class="item-title"></div>
              <div class="item-info"></div>
            </li>
          </ul>
        </div>
        <div class="address-info-right list">
          <ul>
            <li>
              <div class="item-title">Rank</div>
              <div class="item-info"></div>
            </li>
            <li>
              <div class="item-title">TX Count</div>
              <div class="item-info">{{ transactionCount }}</div>
            </li>
            <li>
              <div class="item-title">Total Received</div>
              <div class="item-info">{{ totalReceived | metrix }} MRX</div>
            </li>
            <li>
              <div class="item-title">Total Sent</div>
              <div class="item-info">{{ totalSent | metrix }} MRX</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>
    <Panel width="100%" :address="panelAddress" class="address-detail">
      <nuxt-child :mrc20="mrc20"></nuxt-child>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Contract from "@/models/contract";
import { RequestError } from "@/services/metrixinfo-api";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("blockchain.contract") + " " + this.id
    };
  },
  data() {
    return {
      address: "",
      addressHex: "",
      vm: "",
      type: "",
      mrc20: null,
      mrc721: null,
      balance: "0",
      totalReceived: "0",
      totalSent: "0",
      mrc20Balances: [],
      transactionCount: 0,
      panelAddress: [
        {
          link: "contract-id",
          name: "Transaction List",
          id: this.$route.params.id
        },
        {
          link: "contract-id-rich-list",
          name: "Rich List",
          id: this.$route.params.id
        }
      ]
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      let contract = await Contract.get(params.id);
      return {
        address: contract.address,
        addressHex: contract.addressHex,
        vm: contract.vm,
        type: contract.type,
        mrc20: contract.mrc20,
        mrc721: contract.mrc721,
        balance: contract.balance,
        totalReceived: contract.totalReceived,
        totalSent: contract.totalSent,
        mrc20Balances: contract.mrc20Balances,
        transactionCount: contract.transactionCount
      };
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 404) {
          error({ statusCode: 404, message: `Contract ${param.id} not found` });
        } else {
          error({ statusCode: err.code, message: err.message });
        }
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
      return Math.ceil(this.transactionCount / 20);
    },
    existingTokenBalances() {
      return this.mrc20Balances.filter(token => token.balance !== "0");
    },
    title() {
      return this.mrc20.name + "Overview";
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../styles/pages/contract/_id.less');
</style>