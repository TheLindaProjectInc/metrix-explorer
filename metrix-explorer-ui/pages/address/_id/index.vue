<template>
  <div>
    <div class="animation" v-if="loading">
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    <div class="table" v-else>
      <div class="table-title">
        <div class="item-id">ID</div>
        <div class="item-time">
          <div class="toggler" @click="timetoggle = !timetoggle">
            <div class="time">Time</div>
            <div class="icon">
              <svg data-v-59a70ea1="" xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 20 18">
                <path d="M12706,731.5a4.3,4.3,0,0,1-.7,2.449,5.3,5.3,0,0,1-1.9,1.79,5.411,5.411,0,0,1-2.6.658h-11.3l1.2,0.98a0.939,0.939,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-0.4.337a0.606,0.606,0,0,1-.5.215,1.021,1.021,0,0,1-.6-0.215l-3-2.847a0.776,0.776,0,0,1,0-1.04l3-2.847a1.013,1.013,0,0,1,.6-0.214,0.608,0.608,0,0,1,.5.214l0.4,0.337a0.936,0.936,0,0,1,.2.536,0.972,0.972,0,0,1-.2.535l-1.2.979h11.3a3.017,3.017,0,0,0,2.2-.856,2.77,2.77,0,0,0,.9-2.082,4.511,4.511,0,0,0-.2-1.194,0.709,0.709,0,0,1-.1-0.444,0.6,0.6,0,0,1,.2-0.383l0.4-.367a0.776,0.776,0,0,1,.7-0.214,0.71,0.71,0,0,1,.5.4,4.347,4.347,0,0,1,.6,2.2h0Zm-17.7-1.806a0.709,0.709,0,0,1,.1.444,0.6,0.6,0,0,1-.2.382l-0.4.368a0.773,0.773,0,0,1-.7.214,0.71,0.71,0,0,1-.5-0.4,4.347,4.347,0,0,1-.6-2.2,4.3,4.3,0,0,1,.7-2.449,5.289,5.289,0,0,1,1.9-1.791,5.4,5.4,0,0,1,2.6-.658h11.3l-1.2-.98a0.972,0.972,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l0.4-.337a0.605,0.605,0,0,1,.5-0.214,0.833,0.833,0,0,1,.6.214l3,2.847a0.777,0.777,0,0,1,0,1.041l-3,2.847a1.02,1.02,0,0,1-.6.214,0.605,0.605,0,0,1-.5-0.214l-0.4-.337a0.975,0.975,0,0,1-.2-0.535,0.939,0.939,0,0,1,.2-0.536l1.2-.98h-11.3a3.018,3.018,0,0,0-2.2.857,2.771,2.771,0,0,0-.9,2.082,4.518,4.518,0,0,0,.2,1.194h0Zm0,0" transform="translate(-12686 -721)" class="cls-1">
                </path>
              </svg>
            </div>
          </div>
        </div>
        <div class="item-income">Net Income</div>
        <div class="item-type">Type</div>
        <div class="item-confirmations">Confirmations</div>
      </div>
      <div class="table-body" v-for="item in transactions">
        <div class="table-body-item">
          <div class="item-id">
            <div class="spread" @click="collapsed(item.id)">
              <svg t="1589358527313" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4641" width="18" height="18" class="icon">
                <path d="M821 563.2H566.2v254.9c0 28.1-22.8 51-51 51-28.1 0-51-22.8-51-51V563.2H209.4c-28.1 0-51-22.8-51-51 0-28.1 22.8-51 51-51h254.8V206.4c0-28.1 22.8-51 51-51s51 22.8 51 51v254.9H821c28.2 0 51 22.8 51 51 0 28.1-22.8 50.9-51 50.9z" p-id="4642" fill="#5197D5">
                </path>
              </svg>
            </div>
            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: item.id}}">{{item.id| format(10,10)}}</nuxt-link>
          </div>
          <div class="item-time" v-if="timetoggle">
            <FromNow :timestamp="item.timestamp" />
          </div>
          <div class="item-time" v-else>
            {{item.timestamp | timestamp}}
          </div>
          <div class="item-income" v-if="item.mrc20TokenTransfers">
            <div v-for="mrc20 in item.mrc20TokenTransfers">
              {{mrc20.value | mrc20(mrc20.decimals)}} 
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: mrc20.addressHex}}">{{mrc20.symbol}}</nuxt-link>
            </div>
          </div>
          <div class="item-income" v-else>
            {{item.outputValue - item.inputValue | metrix(3)}}
          </div>
          <div class="item-type" v-if="item.isCoinbase">Coinbase</div>
          <div class="item-type" v-else-if="item.isCoinstake">Coinstake</div>
          <div class="item-type" v-else-if="item.inputs[0].address === '0000000000000000000000000000000000000090' || 
          item.inputs[0].address === '0000000000000000000000000000000000000089'">DGP Contract</div>
          <div class="item-type" v-else-if="item.mrc20TokenTransfers">Token Transfer</div>
          <div class="item-type" v-else>MRX Transfer</div>
          <div class="item-confirmations">
            {{item.confirmations}}
          </div>
        </div>
        <div class="mobile-body">
          <div class="item">
            <div class="title">
              ID
            </div>
            <div class="content">
              <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: item.id}}">{{item.id| format(10,10)}}</nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="title">
              Time
            </div>
            <div class="content">
              {{item.timestamp | timestamp}}
            </div>
          </div>
          <div class="item">
            <div class="title">
              Net Income
            </div>
            <div class="content" v-if="item.mrc20TokenTransfers">
              <div v-for="mrc20 in item.mrc20TokenTransfers">
                {{mrc20.value | mrc20(mrc20.decimals)}} 
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'mrc20-id', params: {id: mrc20.addressHex}}">{{mrc20.symbol}}</nuxt-link>
              </div>
            </div>
            <div class="content" v-else>
              {{item.outputValue - item.inputValue | metrix(3)}}
            </div>
            <div class="title">
              Type
            </div>
            <div class="content" v-if="item.isCoinbase">Coinbase</div>
            <div class="content" v-else-if="item.isCoinstake">Coinstake</div>
            <div class="content" v-else-if="item.inputs[0].address === '0000000000000000000000000000000000000090' || 
            item.inputs[0].address === '0000000000000000000000000000000000000089'">DGP Contract</div>
            <div class="content" v-else-if="item.mrc20TokenTransfers">Token Transfer</div>
            <div class="content" v-else>MRX Transfer</div>
          </div>
          <div class="item">
            <div class="title">
              Confirmations
            </div>
            <div class="content">
              {{item.confirmations}}
            </div>
          </div>
          <div class="arrow-icon" @click="collapsed(item.id)">
            <svg :class="{down : opened.includes(item.id)}" t="1589364875852" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5522" width="24" height="24" class="icon">
              <path d="M340.992 820.736c11.776 11.776 31.232 11.776 43.008 3.072l287.232-287.232c8.704-11.264 11.264-25.088 6.656-35.84-0.512-2.56-5.12-7.68-8.704-12.288L385.536 205.312c-11.776-14.848-30.72-14.848-42.496-3.072-11.776 11.776-11.776 30.72 0 42.496l265.216 268.288-267.264 264.192c-11.776 12.288-12.288 31.232 0 43.52z" fill="#5197D5" p-id="5523">
              </path>
            </svg>
          </div>
        </div>
        <div class="table-body-detail" v-if="opened.includes(item.id)">
          <div class="transaction collapsed">
            <div class="detail tx-detail">
              <div class="utxo-list input-list">
                <div class="summary-item">
                  Inputs ({{ item.inputs.length }})&nbsp;
                  <span class="monospace">{{item.inputValue | metrix(8)}} MRX</span>
                </div>
                <div class="utxo" v-for="input in item.inputs">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: input.address}}">{{input.address}}</nuxt-link>
                    </div>
                  </div>
                  <div class="is-pulled-right">
                    <div class="utxo-value monospace">
                      <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: item.id}}">{{input.value | metrix(8)}}</nuxt-link>
                      <span class="symbol">MRX</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="utxo-list">
                <div class="summary-item">
                  Outputs ({{ item.outputs.length }})&nbsp;
                  <span class="monospace">{{item.outputValue | metrix(8)}} MRX</span>
                </div>
                <div class="utxo" v-for="output in item.outputs">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: output.address}}">{{output.address}}</nuxt-link>
                    </div>
                  </div>
                  <div class="is-pulled-right">
                    <div class="utxo monospace">
                      {{output.value | metrix(8)}} MRX
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail gasrefund" v-if="item.refundValue > 0">
              <div class="utxo-list">
                <div class="utxo">
                  <div class="is-pulled-left">
                    <div class="utxo-address">Gas refund</div>
                  </div>
                </div>
              </div>
              <div class="utxo-list">
                <div class="utxo">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: item.inputs[0].address}}">{{ item.inputs[0].address }}</nuxt-link>
                    </div>
                  </div>
                  <div class="is-pulled-right">
                    <div class="utxo-value monospace">
                      {{item.refundValue | metrix(8)}} MRX
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail mrc-detail" v-if="item.mrc20TokenTransfers" v-for="mrc20 in item.mrc20TokenTransfers">
              <div class="utxo-list input-list">
                <div class="utxo">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc20.from }}">{{ mrc20.from }}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
              <div class="utxo-list">
                <div class="utxo">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc20.to }}">{{ mrc20.to }}</nuxt-link>
                    </div>
                  </div>
                  <div class="is-pulled-right">
                    <div class="utxo-value monospace">
                      {{mrc20.value | mrc20 }} 
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'mrc20-id', params: {id: mrc20.address }}">{{ mrc20.symbol }}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail mrc-detail" v-if="item.mrc721TokenTransfers" v-for="mrc721 in item.mrc721TokenTransfers">
              <div class="utxo-list input-list">
                <div class="utxo">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc721.from }}">{{ mrc721.from }}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
              <div class="utxo-list">
                <div class="utxo">
                  <div class="is-pulled-left">
                    <div class="utxo-address">
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: mrc721.to }}">{{ mrc721.to }}</nuxt-link>
                    </div>
                  </div>
                  <div class="is-pulled-right">
                    <div class="utxo-value monospace">
                      {{mrc721.value | mrc20(mrc721.decimals) }} 
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'mrc20-id', params: {id: mrc721.address }}">{{ mrc721.symbol }}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination :getLink="getLink" :currentPage="currentPage" :pages="pages" />
  </div>
</template>
<script>
import Vue from "vue";
import Pagination from "@/components/pagination";
import Address from "@/models/address";
import Transaction from "@/models/transaction";
import { RequestError } from "@/services/metrixinfo-api";
import { extendAddress } from "@/utils/address";
import { scrollIntoView } from "@/utils/dom";
export default {
  components: { Pagination },
  data() {
    return {
      totalCount: 0,
      transactions: [],
      loading: !1,
      currentPage: Number(this.$route.query.page || 1),
      timetoggle: !1,
      opened: []
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    try {
      if (query.page && !/^[1-9]\d*$/.test(query.page)) {
        redirect(`/address/${params.id}/`);
      }
      let page = Number(query.page || 1);
      let { totalCount, transactions } = await Address.getTransactions(
        params.id,
        { page: page - 1, pageSize: 20 },
        { ip: req && req.ip }
      );
      if (page > 1 && totalCount <= (page - 1) * 20) {
        redirect(`/address/${params.id}/`, {
          page: Math.ceil(totalCount / 20)
        });
      }
      transactions = await Transaction.getBrief(transactions, {
        ip: req && req.ip
      });
      return { totalCount, transactions };
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
    pages() {
      return Math.ceil(this.totalCount / 20);
    }
  },
  methods: {
    getLink(page) {
      return { name: "address-id", params: { id: this.id }, query: { page } };
    },
    async onTransaction({ address, id }) {
      if (
        this.addresses.includes(address) &&
        this.transactions.every(item => item.id !== id)
      ) {
        this.transactions.unshift(await Transaction.getBrief(id));
      }
    },
    transactionChange(oldTransaction, newTransaction) {
      Vue.set(oldTransaction, "blockHeight", newTransaction.blockHeight);
      Vue.set(oldTransaction, "blockHash", newTransaction.blockHash);
      Vue.set(oldTransaction, "timestamp", newTransaction.timestamp);
      oldTransaction.outputs = newTransaction.outputs;
      oldTransaction.refundValue = newTransaction.refundValue;
      oldTransaction.fees = newTransaction.fees;
      oldTransaction.contractSpends = newTransaction.contractSpends;
      oldTransaction.mrc20TokenTransfers = newTransaction.mrc20TokenTransfers;
      oldTransaction.mrc721TokenTransfers = newTransaction.mrc721TokenTransfers;
    },
    subscribeAddress(address) {
      this.$subscribe(
        "address/" + address,
        "address/transaction",
        this._onTransaction
      );
    },
    unsubscribeAddress(address) {
      this.$unsubscribe(
        "address/" + address,
        "address/transaction",
        this._onTransaction
      );
    },
    collapsed(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index,1)
      } else {
        this.opened.push(id)
      }
    }
  },
  mounted() {
    this._onTransaction = this.onTransaction.bind(this);
    for (let address of this.addresses) {
      this.subscribeAddress(address);
    }
    this.$subscribedAddresses = this.addresses;
    //console.log("transactions:", this.transactions);
  },
  beforeDestroy() {
    for (let address of this.$subscribedAddresses) {
      this.unsubscribeAddress(address);
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.loading = !0;
    for (let address of this.addresses) {
      this.unsubscribeAddress(address);
    }
    let page = Number(to.query.page || 1);
    let { totalCount, transactions } = await Address.getTransactions(this.id, {
      page: page - 1,
      pageSize: 20
    });
    this.totalCount = totalCount;
    if (page > this.pages && this.pages > 1) {
      this.$router.push({
        name: "address-id",
        params: { id: this.id },
        query: { page: Math.ceil(totalCount / 20) }
      });
      return;
    }
    this.transactions = await Transaction.getBrief(transactions);
    this.loading = !1;
    this.currentPage = page;
    next();
    for (let address of this.addresses) {
      this.subscribeAddress(address);
    }
    this.$subscribedAddresses = this.addresses;
    scrollIntoView(this.$refs["transaction-list"]);
  },
  scrollToTop: true
};
</script>
<style lang="less" scoped>
@import url("../../../styles/pages/address/_id/index.less");
</style>
