<template>
  <div class="footer-wrapper">
    <div class="footer-container">
      <p class="footer-title">About Us</p>
      <div class="footer-main">
        <div class="footer-info">
          <span>{{process.env.hostname}} is the official blockchain explorer of Metrixcoin, providing blocks, addresses, transactions, contracts and staking queries statistics service.</span>
        </div>
        <div class="footer-dispose">
          <!--
          <div class="footer-change-language">
            <span>Language:</span>
            <div class="select">
              <div class="select-info">
                <i class="flag-en"></i>
                English
                <i class="arrow"></i>
              </div>
              <ul>
                <li>
                  <i class="flag-en"></i>
                  English
                </li>
                <li>
                  <i class="flag-cn"></i>
                  China
                </li>
              </ul>
            </div>
          </div>
          -->
          <div class="footer-cancat">
            <span>Contact details：</span>
            <a :href="'mailto:support@' + process.env.hostname" target="_blank">support@{{process.env.hostname}}</a>
          </div>
        </div>
      </div>
      <div class="footer-split"></div>
      <p class="copyright">2020 The Metrixcoin Developers</p>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="less" scoped>
@import url('../../styles/components/footer.less');
</style>
