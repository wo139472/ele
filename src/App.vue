<template>
  <div id="app">
    <EleHeader :seller="seller" :supportsClassMap="supportsClassMap" />
    <div class="tabbar">
      <router-link tag="div" to="/" exact>商品</router-link>
      <router-link tag="div" to="/ratings">评价</router-link>
      <router-link tag="div" to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :supportsClassMap="supportsClassMap" :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import EleHeader from "./components/EleHeader";

export default {
  data() {
    return {
      seller: {},
      supportsClassMap: [
        "decrease",
        "discount",
        "special",
        "invoice",
        "guarantee"
      ]
    };
  },
  components: {
    EleHeader
  },
  mounted() {
    this.axios("/api/seller").then(res => {
      this.seller = res.data.data;
    });
  }
};
</script>

<style lang="scss">
.auto-img {
  width: 100%;
  height: 100%;
}

.tabbar {
  display: flex;
  height: 40px;
  line-height: 14px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  font-size: 14px;
  color: rgb(77, 85, 93);
  background: #fff;

  .active {
    color: rgb(240, 20, 20);
  }

  div {
    flex: 1;
    padding: 13px 0;
    text-align: center;
  }
}
</style>
