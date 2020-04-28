<template>
  <div class="container">
    <Panel width="100%" title="Block details" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul>
            <li>
              <div class="item-title">Block height</div>
              <div class="item-info">{{ height }}</div>
            </li>
            <li>
              <div class="item-title">Block Time</div>
              <div class="item-info">{{timestamp | timestamp}}(
                <FromNow :timestamp="timestamp" />)
              </div>
            </li>
            <li class="border">
              <div class="item-title">Block size</div>
              <div class="item-info">{{ size }}</div>
            </li>
            <li class="border">
              <div class="item-title">Confirmations</div>
              <div class="item-info">{{ transactions[0].confirmations }}</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li class="border">
              <div class="item-title">Block hash</div>
              <div class="item-info">{{ hash }}</div>
            </li>
            <li>
              <div class="item-title">Block Difficulty</div>
              <div class="item-info">{{ difficulty }}</div>
            </li>
            <li>
              <div class="item-title">Block Reward</div>
              <div class="item-info">{{ reward | metrix(8) }}</div>
            </li>
            <li>
              <div class="item-title">Miner</div>
              <div class="item-info">
              <nuxt-link :to="{name: 'address-id', params: {id: miner}}">{{miner}}</nuxt-link>
              </div>
            </li>
            <li>
              <div class="item-title">Previous Block</div>
              <div class="item-info"></div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" title="Transaction details">
        <table>
          <thead>
            <tr>
              <td>Transaction ID</td>
              <td>Time</td>
              <td>Fee</td>
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
            </tr>
          </tbody>
        </table>
        <pagination />
      </Panel>
    </div>
  </div>
</template>

<script>
import Panel from "../../components/panel";
import Block from "@/models/block";
import Transaction from "@/models/transaction";
import RequestError from "@/services/metrixinfo-api";
import Pagination from "../../components/pagination";
export default {
  components: { Panel, Pagination },
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