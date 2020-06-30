<template>
  <div :class="noMargin? 'panel-main':'panel-main'" :style="{width:width,height:height}">
    <div class="panel-title" v-if="title || address.toString()">
      <div class="logo" v-if="!address.toString()">
        <i :class="icon"></i>
        <!-- <img src="~/assets/sprites.png" alt=""> -->
        <span :style="{fontSize:titleSize+'px'}">{{title}}</span>
      </div>
      <div v-if="address" class="select">
        <ul>
          <li
            :class="{'active': $route.matched.some(route => route.name === item.link)}"
            v-for="item in address"
          >
            <nuxt-link :to="{name: item.link, params: {id:item.id}}">{{item.name}}</nuxt-link>
          </li>
        </ul>
      </div>
      <template v-if="link">
        <nuxt-link :to="link" class="link">
          More
          <i class="arrow"></i>
        </nuxt-link>
      </template>
      <template v-if="toggle">
        <div class="expand" @click="$emit('toggle-expand')" >
          <span v-if="expand==true">Collapse</span>
          <span v-else>Show All</span>
          <i class="arrow"></i>
        </div>
      </template>
      <template v-if="tokens.length > 0">
        <div class="token-select">
          <select name="option" @change="$emit('selectedtoken', $event.target.value)">
            <option disabled="disabled">Select...</option>
            <option selected="ALL">ALL</option>
            <option v-for="token in tokens" :value="token.addressHex">{{token.symbol}}</option>
          </select>
        </div>
      </template>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentToken : "ALL"
    }
  },
  props: {
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: "auto"
    },
    title: {
      type: String,
      default: ""
    },
    titleSize: {
      type: String,
      default: "16"
    },
    icon: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    toggle: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    },
    noMargin: {
      type: String,
      default: ""
    },
    address: {
      type: Array,
      default: () => []
    },
    tokens: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang='less' scoped>
@import url("../../styles/components/panel.less");
</style>
