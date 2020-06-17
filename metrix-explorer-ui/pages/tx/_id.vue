<template>
  <div class="container">
    <Panel class="panel-main">
      <div class="panel-title">
        <div class="logo">
          <span style="font-size: 16px;">Transaction Overview</span>
        </div>
      </div>
      <div class="transaction-info">
        <div class="list">
          <ul class="border">
            <li>
              <div class="item-title">ID</div>
              <div class="item-info monospace">
                <TransactionLink :transaction="id" :plain="true" :clipboard="true"  />
              </div>
            </li>
            <li v-if="blockHeight">
              <div class="item-title">Block Height</div>
              <div class="item-info">
                <nuxt-link class="mrx-link monospace" :to="{name: 'block-id', params: {id: blockHeight}}">{{blockHeight}}</nuxt-link>
              </div>
            </li>
            <li>
              <div class="item-title">Confirmations</div>
              <div class="item-info">{{confirmation}}</div>
            </li>
          </ul>
        </div>
        <div class="list">
          <ul>
            <li>
              <div class="item-title">Time</div>
              <div class="item-info">
                {{timestamp | timestamp}} (<FromNow :timestamp="timestamp" />)
              </div>
            </li>
            <li>
              <div class="item-title">Fee</div>
              <div class="item-info">{{fees | metrix(7)}} MRX</div>
            </li>
            <li>
              <div class="item-title">TX Size </div>
              <div class="item-info">{{size}} bytes</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel class="panel-main margin" >
        <div class="panel-title">
          <div class="logo">
            <span style="font-size: 16px;">Transaction Details</span>
          </div>
        </div>
        <div class="transaction">
          <div class="detail">
            <div class="utxo-list input-list">
              <div class="summary-item">
                Inputs ({{inputs.length}})&nbsp;
                <span class="monospace">{{inputsValue|metrix(7)}}</span> MRX
              </div>
              <div class="utxo" v-for="input in inputs">
                <div class="is-pulled-left">
                  <div class="utxo-address">
                    <div v-if="isCoinbase">
                      Coinbase Input
                    </div>
                    <div v-else>
                      <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: input.address}}">{{input.address}}</nuxt-link>
                    </div>
                  </div>
                  <div class="utxo-type">
                    <span class="key">Type</span>
                    <span class="value">{{input.scriptSig.type}}</span>
                  </div>
                  <div class="utxo-script">
                    <span class="key">Script</span>
                    <span class="value">{{input.scriptSig.asm}}</span>
                  </div>
                </div>
                <div class="is-pulled-right">
                  <div class="utxo-value monospace">
                    <nuxt-link class="mrx-link break-work monospace" :to="{name: 'address-id', params: {id: input.address}}">{{input.value | metrix(8)}} </nuxt-link>
                    <span class="symbol">MRX</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="list-icon"></div>
            <div class="utxo-list">
              <div class="summary-item">
                Outputs ({{outputs.length}})&nbsp;
                <span class="monospace">{{outputsValue|metrix(7)}}</span> MRX
              </div>
              <div class="utxo" v-for="output in outputs">
                <div class="is-pulled-left">
                  <div class="utxo-address">
                    <nuxt-link class="mrx-link break-work monospace" v-if="output.address" :to="{name: 'address-id', params: {id: output.address}}">{{output.address}}</nuxt-link>
                    <span v-else>Empty Output</span>
                  </div>
                  <div class="utxo-type">
                    <span class="key">Type</span>
                    <span class="value">{{output.scriptPubKey.type}}</span>
                  </div>
                  <div class="utxo-script">
                    <span class="key">Script</span>
                    <span class="value" v-if="output.scriptPubKey.asm">{{output.scriptPubKey.asm}}</span>
                    <span class="value" v-else>Empty</span>
                  </div>
                </div>
                <div class="is-pulled-right">
                  <div class="utxo-value monospace">
                    {{output.value | metrix(8)}}
                    <span class="symbol">MRX</span>
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
      title: this.$t("transaction.summary")
    };
  },
  data() {
    return {
      id: "",
      hash: "",
      isCoinbase: false,
      confirmation: "",
      fees: "0",
      inputs: [],
      inputsValue: "0",
      outputs: [],
      outputsValue: "0",
      refundValue: "0",
      blockHeight: null,
      blockHash: null,
      timestamp: null,
      size: 0,
      contractSpends: [],
      mrc20TokenTransfers: [],
      mrc721TokenTransfers: []
    };
  },
  async asyncData({ req, params, error }) {
    try {
      let transaction = await Transaction.get(params.id, { ip: req && req.ip });
      //console.log(transaction);
      return {
        id: transaction.id,
        hash: transaction.hash,
        isCoinbase: transaction.isCoinbase,
        confirmation: transaction.confirmations,
        fees: transaction.fees,
        inputs: transaction.inputs,
        inputsValue: transaction.inputValue,
        outputs: transaction.outputs,
        outputsValue: transaction.outputValue,
        refundValue: transaction.refundValue,
        blockHeight: transaction.blockHeight,
        blockHash: transaction.blockHash,
        timestamp: transaction.timestamp,
        size: transaction.size,
        contractSpends: transaction.contractSpends,
        mrc20TokenTransfers: transaction.mrc20TokenTransfers,
        mrc721TokenTransfers: transaction.mrc721TokenTransfers
      };
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 404) {
          error({
            statusCode: 404,
            message: `Transaction ${param.id} not found`
          });
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
@import url("../../styles/pages/tx/_id.less");
</style>