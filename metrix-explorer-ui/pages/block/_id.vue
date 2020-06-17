<template>
  <div class="container">
    <Panel width="100%" title="Block details" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul class="border">
            <li>
              <div class="item-title">Height</div>
              <div class="item-info monospace">{{ height }}</div>
            </li>
            <li>
              <div class="item-title">Time</div>
              <div class="item-info">{{timestamp | timestamp}}(
                <FromNow :timestamp="timestamp" />)
              </div>
            </li>
            <li>
              <div class="item-title">Size</div>
              <div class="item-info monospace">{{ size }} bytes</div>
            </li>
            <li>
              <div class="item-title">Difficulty</div>
              <div class="item-info monospace">{{ difficulty }}</div>
            </li>
            <li>
              <div class="item-title">Confirmations</div>
              <div class="item-info monospace">{{ transactions[0].confirmations }}</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li>
              <div class="item-title">Hash</div>
              <div class="item-info blockhash"><span class="mrx-link monospace break-word plain">{{ hash }}</span></div>
            </li>
            <li>
              <div class="item-title">Weight</div>
              <div class="item-info monospace">{{ weight }}</div>
            </li>
            <li>
              <div class="item-title">Reward</div>
              <div class="item-info monospace">{{ reward | metrix(8) }} MRX</div>
            </li>
            <li>
              <div class="item-title">Miner</div>
              <div class="item-info">
              <nuxt-link class="mrx-link monospace break-word" :to="{name: 'address-id', params: {id: miner}}">{{miner}}</nuxt-link>
              </div>
            </li>
            <li v-if="height > 0">
              <div class="item-title">Previous Block</div>
              <div class="item-info">
              <nuxt-link class="mrx-link monospace break-word" :to="{name: 'block-id', params: {id: (height - 1)}}">{{ height - 1 }}</nuxt-link>
              </div>
            </li>
            <li v-if="height < (height + transactions[0].confirmations - 1)">
              <div class="item-title">Next Block</div>
              <div class="item-info">
              <nuxt-link class="mrx-link monospace break-word" :to="{name: 'block-id', params: {id: (height + 1)}}">{{ height + 1 }}</nuxt-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" title="Transaction details" class="margin">
        <div class="table">
          <div class="table-title">
            <div class="item-id">Transaction ID</div>
            <div class="item-value">Value</div>
            <div class="item-fee">Fee</div>
            <div class="item-type">Type</div>
          </div>
          <div class="table-body" v-for="transaction in transactions">
            <div class="table-body-item">
              <div class="item-id">
                <div class="spread" @click="collapsed(transaction.id)">
                  <svg t="1589358527313" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4641" width="18" height="18" class="icon">
                    <path d="M821 563.2H566.2v254.9c0 28.1-22.8 51-51 51-28.1 0-51-22.8-51-51V563.2H209.4c-28.1 0-51-22.8-51-51 0-28.1 22.8-51 51-51h254.8V206.4c0-28.1 22.8-51 51-51s51 22.8 51 51v254.9H821c28.2 0 51 22.8 51 51 0 28.1-22.8 50.9-51 50.9z" p-id="4642" fill="#5197D5">
                    </path>
                  </svg>
                </div>
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: transaction.id}}"
                >{{transaction.id | format(10,10)}}</nuxt-link>
              </div>
              <div class="item-value" v-if="transaction.outputValue > 0">{{ transaction.outputValue | metrix(4) }}</div>
              <div class="item-value" v-else>-</div>
              <div class="item-fee" v-if="transaction.fees !== '0'">{{transaction.fees | metrix(3)}} MRX</div>
              <div class="item-fee" v-else>-</div>
              <div class="item-type" v-if="transaction.isCoinbase">Coinbase</div>
              <div class="item-type" v-else-if="transaction.isCoinstake">Coinstake</div>
              <div class="item-type" v-else-if="transaction.inputs[0].address === '0000000000000000000000000000000000000090' || 
              transaction.inputs[0].address === '0000000000000000000000000000000000000089'">DGP Contract</div>
              <div class="item-type" v-else>MRX Transfer</div>
            </div>
            <div class="mobile-body">
              <div class="item">
                <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: transaction.id}}">{{transaction.id | format(10,10)}}</nuxt-link>
              </div>
              <div class="item">
                <div class="title">Value</div>
                <div class="content" v-if="transaction.outputValue > 0">{{transaction.outputValue | metrix(4)}} MRX</div>
                <div class="content" v-else> - </div>
              </div>
              <div class="item">
                <div class="title">Fee</div>
                <div class="content">{{transaction.fees | metrix(4)}} MRX</div>
              </div>
              <div class="item">
                <div class="title">Type</div>
                <div class="content" v-if="transaction.isCoinbase">Coinbase</div>
                <div class="content" v-else-if="transaction.isCoinstake">Coinstake</div>
                <div class="content" v-else-if="transaction.inputs[0].address === '0000000000000000000000000000000000000090' || 
                  transaction.inputs[0].address === '0000000000000000000000000000000000000089'">DGP Contract</div>
                <div class="content" v-else>MRX Transfer</div>
              </div>
              <div class="arrow-icon" @click="collapsed(transaction.id)" >
                <svg :class="{down : opened.includes(transaction.id)}" t="1589364875852" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5522" width="24" height="24" class="icon">
                  <path d="M340.992 820.736c11.776 11.776 31.232 11.776 43.008 3.072l287.232-287.232c8.704-11.264 11.264-25.088 6.656-35.84-0.512-2.56-5.12-7.68-8.704-12.288L385.536 205.312c-11.776-14.848-30.72-14.848-42.496-3.072-11.776 11.776-11.776 30.72 0 42.496l265.216 268.288-267.264 264.192c-11.776 12.288-12.288 31.232 0 43.52z" fill="#5197D5" p-id="5523">
                  </path>
                </svg>
              </div>
            </div>
            <div class="table-body-detail" v-if="opened.includes(transaction.id)">
              <div class="transaction collapsed">
                <div class="detail tx-detail">
                  <div class="utxo-list input-list">
                    <div class="summary-item">
                      Inputs ({{ transaction.inputs.length }})&nbsp;
                      <span class="monospace">{{transaction.inputValue | metrix(8)}} MRX</span>
                    </div>
                    <div class="utxo" v-for="input in transaction.inputs">
                      <div class="is-pulled-left">
                        <div class="utxo-address">
                          <div v-if="transaction.isCoinbase">
                            Coinbase Input
                          </div>
                          <div v-else>
                            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: input.address}}">{{input.address}}</nuxt-link>
                          </div>
                        </div>
                      </div>
                      <div class="is-pulled-right">
                        <div class="utxo-value monospace">
                          <nuxt-link class="mrx-link break-word monospace" :to="{name: 'tx-id', params: {id: transaction.id}}">{{input.value | metrix(8)}}</nuxt-link>
                          <span class="symbol">MRX</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="utxo-list">
                    <div class="summary-item">
                      Outputs ({{ transaction.outputs.length }})&nbsp;
                      <span class="monospace">{{transaction.outputValue | metrix(8)}} MRX</span>
                    </div>
                    <div class="utxo" v-for="output in transaction.outputs">
                      <div class="is-pulled-left">
                        <div class="utxo-address">
                          <div v-if="output.scriptPubKey.type === 'empty'">
                            Empty Output
                          </div>
                          <div v-else-if="output.scriptPubKey.type === 'nulldata'">
                            OP_RETURN Output
                          </div>
                          <div>
                            <nuxt-link class="mrx-link break-word monospace" :to="{name: 'address-id', params: {id: output.address}}">{{output.address}}</nuxt-link>
                          </div>
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
              </div>            
            </div>
          </div>
        </div>
      </Panel>
    </div>
  </div>
</template>

<script>
import Panel from "../../components/panel";
import Block from "@/models/block";
import Transaction from "@/models/transaction";
import RequestError from "@/services/metrixinfo-api";
export default {
  components: { Panel },
  head() {
    return {
      title: ""
    };
  },
  data() {
    return {
      height: 0,
      hash: 0,
      time: 0,
      size: 0,
      reward: 0,
      difficulty: 0,
      merkleRoot: "",
      miner: null,
      prevHash: null,
      nextHash: null,
      tx: [],
      transactions: [],
      currentPage: Number(this.$route.query.page || 1),
      opened: []
    };
  },
  async asyncData({ req, params, query, redirect, error }) {
    let id = params.id;
    try {
      let block = await Block.get(id, { ip: req && req.ip });

      let transactions = await Transaction.getBrief(
        block.transactions.slice(0, 20),
        { ip: req && req.ip }
      );
      return {
        height: block.height,
        hash: block.hash,
        timestamp: block.timestamp,
        size: block.size,
        weight: block.weight,
        reward: block.reward,
        difficulty: block.difficulty,
        merkleRoot: block.merkleRoot,
        miner: block.miner || null,
        prevHash: block.prevHash || null,
        nextHash: block.nextHash || null,
        tx: block.transactions,
        transactions
      };
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 404) {
          error({ statusCode: 404, message: `Block ${id} not found` });
        } else {
          error({ statusCode: err.code, message: err.message });
        }
      } else {
        error({ statusCode: 500, message: err.message });
      }
    }
  },
  methods: {
      collapsed(id) {
        const index = this.opened.indexOf(id);
        if (index > -1) {
          this.opened.splice(index,1)
        } else {
          this.opened.push(id)
        }
      }
  }
};
</script>

<style lang="less" scoped>
@import url("../../styles/pages/block/_id.less");
</style>
