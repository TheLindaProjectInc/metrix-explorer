<template>
  <div class="container">
    <Panel width="100%" title="Address Overview" noMargin="true">
      <div class="address-info">
        <div class="list">
          <ul class="border">
            <li>
              <div class="item-title">Address</div>
              <div class="item-info">
                <nuxt-link class="mrx-link monospace break-word" :to="{name: 'address-id', params: {id: id}}">{{id}}</nuxt-link>
              </div>
            </li>
            <li>
              <div class="item-title">Metrix Balance</div>
              <div class="item-info monospace">{{ balance | metrix(8) }} MRX</div>
            </li>
            <li>
              <div class="item-title">Unconfirmed Balance</div>
              <div class="item-info monospace">{{ unconfirmed | metrix(8) }} MRX</div>
            </li>            
            <li >
              <div class="item-title">Staking Balance</div>
              <div class="item-info monospace">{{ staking | metrix(8) }} MRX</div>
            </li>
            <li>
              <div class="item-title">Token Balances</div>
              <div class="item-info monospace">
                <div v-if="mrc20Balances.length > 0" v-for="token in mrc20Balances">
                  {{token.balance | mrc20(token.decimals, true) }} 
                  <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: token.address}}">{{token.symbol}}</nuxt-link>
                </div>
                <div v-if="mrc721Balances.length > 0" v-for="token in mrc721Balances">
                  {{token.balance | mrc20(token.decimals, true) }} 
                  <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc721-id', params: {id: token.address}}">{{token.symbol}}</nuxt-link>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="list">
          <ul>
            <li>
              <div class="item-title">Rank</div>
              <div class="item-info">{{ ranking }}</div>
            </li>
            <li>
              <div class="item-title">Transaction Count</div>
              <div class="item-info monospace">{{ transactionCount }}</div>
            </li>
            <li>
              <div class="item-title">Blocks Mined</div>
              <div class="item-info monospace">{{ blocksMined }}</div>
            </li>            
            <li>
              <div class="item-title">Total Received</div>
              <div class="item-info monospace">{{ totalReceived | metrix(8) }} MRX</div>
            </li>
            <li>
              <div class="item-title">Total Sent</div>
              <div class="item-info monospace">{{ totalSent | metrix(8) }} MRX</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>
    <Panel :address="address" class="address-detail panel-main margin">
      <nuxt-child></nuxt-child>
    </Panel>
  </div>
</template>
<script>
import Panel from "../../components/panel";
import Address from "@/models/address";
import Transaction from "@/models/transaction";
export default {
  components: { Panel },
  head() {
    return {
      title: this.$t("blockchain.address") + " " + this.id
    };
  },
  middleware: "check-address",
  data() {
    return {
      balance: "0",
      totalReceived: "0",
      totalSent: "0",
      unconfirmed: "0",
      staking: "0",
      mrc20Balances: [],
      ranking: 0,
      blocksMined: 0,
      transactionCount: 0,
      address: [
        {
          link: "address-id",
          name: "Transaction List",
          id: this.$route.params.id
        },
        {
          link: "address-id-balance",
          name: "Balance Change",
          id: this.$route.params.id
        },
        {
          link: "address-id-token-balance",
          name: "Token Balance Change",
          id: this.$route.params.id
        }
      ]
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      let address = await Address.get(params.id, { ip: req && req.ip });
      return address;
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
    addresses() {
      let result = [];
      for (let address of this.id.split(",")) {
        if (!result.includes(address)) {
          result.push(address);
        }
      }
      return result;
    },
    existingTokenBalances() {
      return this.mrc20Balances.filter(token => token.balance !== "0");
    },
    myAddresses() {
      return this.$store.state.address.myAddresses;
    }
  },
  methods: {
    addMyAddress(address) {
      this.$store.commit("address/my-addresses/add", address);
    },
    removeMyAddress(address) {
      this.$store.commit("address/my-addresses/remove", address);
    }
  }
};
</script>
<style lang="less" scoped>
@import url('../../styles/pages/address/_id.less');
</style>