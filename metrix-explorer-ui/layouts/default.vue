<template>
  <div id="app">
    <header class="header-container">
      <Navigator />
    </header>
    <div class="background">
       <nuxt />
    </div>
    <MyAddresses class="my-addresses" />
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script>
import Navigator from "@/components/header";
import Breadcrumb from "@/components/breadcrumb/index.vue";
import Footer from "@/components/footer";
import MyAddresses from "@/components/my-addresses.vue";

export default {
  head() {
    return {
      htmlAttrs: {
        lang: this.$store.state.locale.language
      }
    };
  },
  mounted() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          registration.update();
          setInterval(() => registration.update(), 3600 * 1000);
        });
    }
    if (window.Notification) {
      Notification.requestPermission();
    }
  },
  components: { Navigator, Breadcrumb, Footer, MyAddresses }
};
</script>

<style lang="less" scoped>
.size(@data) {
  @result: (@data*0.75);
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #f5f6f8;
}

.header-container {
  padding: 0 5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: @metrix-blue;
}

@media only screen and (max-width: 1024px) {
  .container {
    margin-top: 3.8rem;
    width: 100%;
  }

  .header-container {
    padding: 0 1rem;
    box-sizing: border-box;
    width: 100%;
  }

  .background {
    margin: 0;
  }
}

.container {
  width: 1200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
}

.background {
  margin-top: 2.8rem;
}

.my-addresses {
  position: fixed;
  z-index: 100;
  @media (max-width: 768px) {
    bottom: 1em;
    right: 1em;
  }
  @media (min-width: 769px) {
    bottom: 2em;
    right: 2em;
  }
}
</style>
