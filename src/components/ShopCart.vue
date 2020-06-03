<template>
  <div class="shop-cart">
    <div class="shop-cart-content">
      <div class="content-left" @click="toggleShopCartList">
        <div class="icon-wrapper icon-shopping_cart" :class="{active:totalCount}">
          <span class="shop-cart-count" v-show="totalCount">{{totalCount}}</span>
        </div>
        <div class="total-price" :class="{active:totalCount}">
          <span class="price-content">¥{{totalPrice}}</span>
        </div>
        <span class="delivery-price">另需配送费¥{{seller.deliveryPrice}}元</span>
      </div>
      <div class="content-right">
        <div class="shop-cart-buy-btn" :class="{enough:totalPrice>=seller.minPrice}">{{buyBtnText}}</div>
      </div>
    </div>
    <transition name="slider">
      <div class="shop-cart-list" v-show="showList">
        <div class="shop-cart-list-header">
          <div class="title">购物车</div>
          <div class="empty" @click="$emit('empty')">清空</div>
        </div>
        <div class="shop-cart-list-content" ref="listBody">
          <ul>
            <li v-for="good in shopcartList" :key="good.name" class="shop-cart-list-item">
              <div class="name">{{good.name}}</div>
              <div class="price">¥{{good.price}}</div>
              <CountControl
                :food="good"
                @minusCount="(food) => $emit('minusCount',food)"
                @addCount="(food) => $emit('addCount',food)"
              />
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="shop-cart-cover" @click="toggleShopCartList" v-show="showList"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import CountControl from "./CountControl";

export default {
  props: {
    shopcartList: {
      type: Array,
      required: true
    },
    seller: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showList: false
    };
  },
  computed: {
    totalCount() {
      let totalCount = 0;

      this.shopcartList.forEach(food => {
        totalCount += food.count;
      });

      return totalCount > 99 ? 99 : totalCount;
    },
    totalPrice() {
      let totalPrice = 0;

      this.shopcartList.forEach(food => {
        totalPrice += food.price * food.count;
      });

      return totalPrice;
    },
    buyBtnText() {
      let text = `¥${this.seller.minPrice}元起送`;

      let { totalPrice, seller } = this;

      if (totalPrice > 0 && totalPrice < seller.minPrice) {
        text = `还差¥${seller.minPrice - totalPrice}元起送`;
      }

      if (totalPrice >= seller.minPrice) {
        text = "立即购买";
      }

      return text;
    }
  },
  methods: {
    toggleShopCartList() {
      if (!this.showList && this.totalCount > 0) {
        this.showList = true;
      } else {
        this.showList = false;
      }
    }
  },
  components: {
    CountControl
  },
  watch: {
    totalCount(newValue, oldValue) {
      // 当用户将购物车商品删除掉时，购物车要自动隐藏
      if (newValue !== oldValue && newValue === 0) {
        this.showList = false;
      }
    },
    showList(newValue, oldValue) {
      if (newValue !== oldValue && newValue) {
        // 这里只是数据发生改变，页面还未更新完毕
        this.$nextTick(() => {
          if (!this.listScroll) {
            this.listScroll = new BScroll(this.$refs.listBody, {
              click: true
            });
          } else {
            this.listScroll.refresh();
          }
        });
      }
    }
  },
  beforeDestroy() {
    if (this.listScroll) {
      this.listScroll.destroy();
      this.listScroll = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.shop-cart {
  position: relative;
}

.shop-cart-content {
  position: relative;
  display: flex;
  width: 100vw;
  height: 48px;
  background: #141d27;
  z-index: 80;

  .content-left {
    flex: 1;
    padding-left: 12px;
  }

  .icon-wrapper {
    position: relative;
    top: -14px;
    display: inline-block;
    width: 56px;
    height: 56px;
    border: 6px solid #141d27;
    border-radius: 28px;
    font-size: 24px;
    line-height: 44px;
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    background: #43474d;

    &.active {
      color: #fff;
      background: rgb(0, 160, 220);
    }

    .shop-cart-count {
      position: absolute;
      top: -6px;
      right: -6px;
      padding: 0 6px;
      min-width: 24px;
      height: 16px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 9px;
      line-height: 14px;
      text-align: center;
      vertical-align: middle;
      color: #fff;
      background: rgb(240, 20, 20);
    }
  }

  .total-price {
    display: inline-block;
    padding: 12px 0;
    margin-left: 12px;
    line-height: 24px;
    font-weight: 700;
    font-size: 16px;
    vertical-align: top;
    color: rgba(255, 255, 255, 0.4);

    &.active {
      color: #fff;
    }

    .price-content {
      padding-right: 12px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .delivery-price {
    display: inline-block;
    margin-left: 12px;
    font-size: 12px;
    font-weight: 200;
    vertical-align: top;
    color: rgba(255, 255, 255, 0.4);
    line-height: 48px;
  }

  .content-right {
    flex: 0 0 105px;
    width: 105px;
  }
  .shop-cart-buy-btn {
    width: 100%;
    height: 100%;
    line-height: 48px;
    font-weight: 700;
    font-size: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.2);
    &.enough {
      color: #fff;
      background: rgb(4, 168, 67);
    }
  }
}

.shop-cart-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  transform: translateY(-100%);
  z-index: 50;

  &.slider-enter,
  &.slider-leave-to {
    transform: translateY(0);
  }

  &.slider-enter-active,
  &.slider-leave-active {
    transition: all 0.3s linear;
  }

  &.slider-enter-to,
  &.slider-leave {
    transform: translateY(-100%);
  }

  .shop-cart-list-header {
    padding: 0 18px;
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    background: #f3f5f7;

    .title {
      font-size: 14px;
      font-weight: 200;
      color: rgb(7, 17, 27);
    }

    .empty {
      font-size: 12px;
      color: rgb(0, 160, 220);
    }
  }

  .shop-cart-list-content {
    max-height: 218px;
    padding: 0 18px;
    background: #fff;
    overflow: hidden;
  }

  .shop-cart-list-item {
    display: flex;
    padding: 12px 0;
    height: 48px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);

    &:last-child {
      border-bottom: 0;
    }

    .name {
      flex: 1;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .price {
      margin-left: 18px;
      margin-right: 12px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(240, 20, 20);

      &:first-letter {
        font-size: 10px;
        font-weight: 200;
      }
    }
  }
}

.shop-cart-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(7, 17, 27, 0.6);
  backdrop-filter: blur(10px);

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }

  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.4s linear;
  }

  &.fade-enter-to,
  &.fade-leave {
    opacity: 1;
  }
}
</style>