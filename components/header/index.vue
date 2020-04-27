<template>
  <div class="nav-container">
    <nuxt-link to="/" class="anchor">
      <span class="metrix-icon metrix-icon--metrix"></span>
      <span class="title">Metrix.info</span>
    </nuxt-link>
    <nav class="nav-list">
      <div class="nav-item">
        <div>
          <nuxt-link to="/block" class="nav-item-main">
            Blockchain
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>
            <nuxt-link to="/block">Block</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tx">Transaction</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/misc/rich-list">Rich List</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/contract/tokens" class="nav-item-main">
            Tokens
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li>
            <nuxt-link to="/contract/tokens">Token Overview</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/">Token Transactions</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <span class="nav-item-main">
            Resources
            <span></span>
          </span>
        </div>
        <ul>
          <li>
            <a href="https://chart.metrix.info/"  target="_Blank">Charts</a>
          </li>
          <li>
            <nuxt-link to="/misc/biggest-miners">Biggest Miners</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/misc/api">Browser API</nuxt-link>
          </li>
          <li>
            <a href="https://testnet.metrix.info/"  target="_Blank">Testnet Explorer</a>
          </li>
          <li>
            <nuxt-link to="/misc/toolbox">Toolbox</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="nav-item">
        <div>
          <nuxt-link to="/" class="nav-item-main">
            More
            <span></span>
          </nuxt-link>
        </div>
        <ul>
          <li><a href="https://metrix.org/"  target="_Blank">Official Website</a></li>
          <li>
            <a href="https://forum.metrix.org/"  target="_Blank">Discord</a></li>
          <li><a href="https://metrixeco.io/wallet"  target="_Blank">Wallets</a></li></li>
        </ul>
      </div>

      <Search class="search" />
    </nav>
  </div>
</template>

<script>
import Search from "@/components/search";
export default {
  components: { Search }
};
</script>

<style lang="less" scoped>
@import url('../../styles/components/header.less');
</style>


