<template>
  <div class="container">
    <div class="panel-main">
      <div class="panel-title">
        <div class="logo">
          <span style="font-size: 16px;">Address Overview</span>
        </div>
        <div class="star">
          <div class="icon">
          </div>
          <p>Subscribe</p>
        </div>
      </div>
      <div class="address-info">
        <div class="list">
          <ul class="border">
            <li>
              <div class="item-title">Address</div>
              <div class="item-info address-item monospace">{{id}}</div>
            </li>
            <li>
              <div class="item-title">Metrix Balance</div>
              <div class="item-info monospace">{{ balance | metrix }} MRX</div>
            </li>
            <li >
              <div class="item-title">Mining Amount</div>
              <div class="item-info monospace">{{ staking | metrix }} MRX</div>
            </li>
            <li>
              <div class="item-title">Token Balance</div>
              <div class="item-info monospace"></div>
            </li>
            <li>
              <div class="item-title">Optional</div>
              <div class="item-info monospace"></div>
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
              <div class="item-title">Total Received</div>
              <div class="item-info monospace">{{ totalReceived | metrix }} MRX</div>
            </li>
            <li>
              <div class="item-title">Total Sent</div>
              <div class="item-info monospace">{{ totalSent | metrix }} MRX</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
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