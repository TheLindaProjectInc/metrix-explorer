<template>
  <div class="nav-container">
    <nuxt-link to="/" class="anchor">
      <span class="metrix-icon metrix-icon--metrix"></span>
      <span class="title">explorer.metrixcoin.com</span>
    </nuxt-link>
    <nav class="nav-list">
      <div class="nav-item">
        <div>
          <nuxt-link to="/block" class="nav-item-main">
            Blockchain
            <span class="triangle"></span>
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
            <span class="triangle"></span>
          </nuxt-link>
        </div>
        <ul>
          <li>
            <nuxt-link to="/contract/tokens">Token Overview</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/contract/deal_list">Token Transactions</nuxt-link>
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
        <ul>
          <li>
            <a href="/"  target="_Blank">Charts</a>
          </li>
          <li>
            <nuxt-link to="/misc/biggest-miners">Biggest Miners</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/misc/api">Browser API</nuxt-link>
          </li>
          <li>
            <a href="https://testnet.metrixcoin.com/"  target="_Blank">Testnet Explorer</a>
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


