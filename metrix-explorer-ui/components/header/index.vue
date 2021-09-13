<template>
  <div class="nav-container">
    <nuxt-link to="/" class="anchor">
      <img src="./../../assets/images/logo.png" alt="Metrix Logo" style="max-height: 45px">
      <!-- <span class="metrix-icon metrix-icon--metrix"></span> -->
      <span class="title">{{process.env.HOST_FQDN}}</span>
    </nuxt-link>
    <div :class="{fold: fold}">
      <nav class="nav-list">
        <div class="nav-item">
          <div>
            <span class="nav-item-main">
              Blockchain
              <span class="triangle"></span>
            </span>
          </div>
          <ul>
            <li>
              <nuxt-link @click.native="unfold" to="/block">Block</nuxt-link>
            </li>
            <li>
              <nuxt-link @click.native="unfold" to="/tx">Transaction</nuxt-link>
            </li>
            <li>
              <nuxt-link @click.native="unfold" to="/misc/richlist">Rich List</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="nav-item">
          <div>
            <span class="nav-item-main">
              Tokens
              <span class="triangle"></span>
            </span>
          </div>
          <ul>
            <li>
              <nuxt-link @click.native="unfold" to="/mrc20">Token Overview</nuxt-link>
            </li>
            <li>
              <nuxt-link @click.native="unfold" to="/mrc20/tx">Token Transactions</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="nav-item">
          <div>
            <span class="nav-item-main">
              Resources
              <span class="triangle"></span>
            </span>
          </div>
          <ul><!--
            <li>
              <a @click.native="unfold" href="/"  target="_Blank">Charts</a>
            </li>
            <li>
              <nuxt-link @click.native="unfold" to="/misc/biggest-miners">Biggest Miners</nuxt-link>
            </li>-->
            <li>
              <a @click.native="unfold" href="https://github.com/TheLindaProjectInc/metrix-explorer/tree/master/metrix-explorer-api">Explorer API</a>
            </li>
            <li>
              <a @click.native="unfold" href="https://testnet-explorer.metrixcoin.com/"  target="_Blank">Testnet Explorer</a>
            </li>
            <!--
            <li>
              <nuxt-link @click.native="unfold" to="/misc/toolbox">Toolbox</nuxt-link>
            </li>
            -->
          </ul>
        </div>

        <div class="nav-item">
          <div>
            <nuxt-link to="/" class="nav-item-main">
              More
              <span class="triangle"></span>
            </nuxt-link>
          </div>
          <ul>
            <li><a href="https://metrixcoin.com/"  target="_Blank">Official Website</a></li>
            <li>
              <a href="https://discord.gg/BRqar6x"  target="_Blank">Discord</a></li>
            <li><a href="https://github.com/TheLindaProjectInc/Altitude/releases/latest"  target="_Blank">Wallets</a></li></li>
          </ul>
        </div>
        <Search class="search" />
      </nav>
      <button class="fold-btn" @click="fold = !fold">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" class="icon-fold">
          <path fill="currentColor" d="M 16 132 h 416 c 8.837 0 16 -7.163 16 -16 V 76 c 0 -8.837 -7.163 -16 -16 -16 H 16 C 7.163 60 0 67.163 0 76 v 40 c 0 8.837 7.163 16 16 16 Z m 0 160 h 416 c 8.837 0 16 -7.163 16 -16 v -40 c 0 -8.837 -7.163 -16 -16 -16 H 16 c -8.837 0 -16 7.163 -16 16 v 40 c 0 8.837 7.163 16 16 16 Z m 0 160 h 416 c 8.837 0 16 -7.163 16 -16 v -40 c 0 -8.837 -7.163 -16 -16 -16 H 16 c -8.837 0 -16 7.163 -16 16 v 40 c 0 8.837 7.163 16 16 16 Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import Search from "@/components/search";
export default {
  components: { Search },
  data() {
    return {
      fold: !1
    }
  },
  methods: {
    unfold() {
      this.fold = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../../styles/components/header.less');
</style>


