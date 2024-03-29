<template>
  <div class="container">
    <Panel title="MRC721 Token Overview" width="100%" noMargin="true">
      <div class="address-info">
        <div class="address-info-left list">
          <ul class="border">
            <li>
              <div class="item-title">Name</div>
              <div class="item-info">
                <span class="token-name" :class="`token-${addressHex}`"></span>
                {{mrc721.name}}
              </div>
            </li>
            <li>
              <div class="item-title">Total Supply</div>
              <div class="item-info monospace">
                {{ mrc721.totalSupply }}
                {{ mrc721.symbol || $t('contract.token.tokens') }}
              </div>
            </li>
          </ul>
        </div>
        <div class="address-info-right list">
          <ul>
            <li>
              <div class="item-title">Contract Address</div>
              <div class="item-info">
                <nuxt-link class="mrx-link break-word monospace" :to="{name:'contract-id',params:{id: address}}">{{ address }}</nuxt-link>
              </div>
            </li>
            <li>
              <div class="item-title">TX Count</div>
              <div class="item-info monospace">{{ transactionCount }} </div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <Panel width="100%" title="Transaction List" class="address-detail margin">
      <nuxt-child :mrc721="mrc721"></nuxt-child>
    </Panel>
  </div>
</template>
<script>
import Panel from "@/components/panel";
import Contract from "@/models/contract";
import { RequestError } from "@/services/metrixinfo-api";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("blockchain.token") + " " + this.id
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
          link: "mrc721-id",
          name: "Transaction List",
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
        mrc721Balances: contract.mrc721Balances,
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
      return this.mrc721Balances.filter(token => token.balance !== "0");
    },
    title() {
      return this.mrc721.name + "Overview";
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../styles/pages/mrc721/_id.less');
</style>