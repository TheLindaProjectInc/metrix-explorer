<template>
  <div class="container">
    <Panel width="100%" height="255px" title="Transaction Overview" noMargin="true">
      <div class="block-info">
        <div class="block-info-left list">
          <ul>
            <li v-if="blockHeight">
              <div class="item-title">Block Height</div>
              <div class="item-info">{{blockHeight}}</div>
            </li>
            <li>
              <div class="item-title">Confirmations</div>
              <div class="item-info">{{confirmation}}</div>
            </li>
            <li>
              <div class="item-title">Time</div>
              <div class="item-info">{{timestamp | timestamp}}</div>
            </li>
            <li>
              <div class="item-title">TX Size</div>
              <div class="item-info">{{size}}</div>
            </li>
          </ul>
        </div>
        <div class="block-info-right list">
          <ul>
            <li>
              <div class="item-title">Input Value</div>
              <div class="item-info">{{inputsValue | metrix(7)}} MRX</div>
            </li>
            <li>
              <div class="item-title">Output Value</div>
              <div class="item-info">{{outputsValue | metrix(7)}} MRX</div>
            </li>
            <li>
              <div class="item-title">Fee</div>
              <div class="item-info">{{fees | metrix(7)}} MRX</div>
            </li>
          </ul>
        </div>
      </div>
    </Panel>

    <div class="deal-detail">
      <Panel width="100%" title="Transaction Details">
        <div class="deal-detail-info">
          <div class="deal-detail-list">
            <div class="list-send">
              <div>Inputs ({{inputs.length}}) {{inputsValue|metrix(7)}} MRX</div>
              <ul>
                <li v-for="input in inputs">
                  <span><nuxt-link :to="{name: 'address-id', params: {id: input.address}}">{{input.address}}</nuxt-link></span>
                  <span>{{input.value | metrix(3)}}MRX</span>
                </li>
              </ul>
            </div>
            <div class="list-icon"></div>
            <div class="list-receive">
              <div>Outputs ({{outputs.length}}) {{outputsValue|metrix(7)}} BTC</div>
              <ul>
                <li v-for="output in outputs">
                  <span><nuxt-link :to="{name: 'address-id', params: {id: output.address}}">{{output.address}}</nuxt-link> </span>
                  <span>{{output.value | metrix(3)}}MRX</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="script">
            <div class="script-input">
              <div class="script-caption">Input script</div>
              <ul>
                <li v-for="input in inputs">{{input.scriptSig.asm}}</li>
              </ul>
            </div>
            <div class="script-output">
              <div class="script-caption">Output Script</div>
              <ul>
                <li v-for="output in outputs">{{output.scriptPubKey.asm}}</li>
              </ul>
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
      console.log(transaction);
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