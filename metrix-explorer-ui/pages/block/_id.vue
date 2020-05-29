<template>
  <div class="container">
    <Panel width="100%" title="Block details" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list-left">
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
        <div class="block-info-right list-right">
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
        <table>
          <thead>
            <tr>
              <td>Transaction ID</td>
              <td>Time</td>
              <td>Fee</td>
              <td>Type</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions">
              <td>
                <nuxt-link
                  :to="{name: 'tx-id', params: {id: transaction.id}}"
                >{{transaction.id | format(15,6)}}</nuxt-link>
              </td>
              <td>
                <FromNow :timestamp="transaction.timestamp" />
              </td>
              <td v-if="transaction.fees !== '0'">{{transaction.fees | metrix(3)}} MRX</td>
              <td v-else>-</td>
              <td v-if="transaction.isCoinbase">Coinbase</td>
              <td v-else-if="transaction.isCoinstake">Coinstake</td>
              <td v-else-if="transaction.inputs[0].address === '0000000000000000000000000000000000000089' || 
              transaction.inputs[0].address === '0000000000000000000000000000000000000088'">DGP Contract</td>
              <td v-else>MRX Transfer</td>
            </tr>
          </tbody>
        </table>
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
      currentPage: Number(this.$route.query.page || 1)
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
  }
};
</script>

<style lang="less" scoped>
@import url("../../styles/pages/block/_id.less");
</style>
