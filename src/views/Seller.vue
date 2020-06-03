<template>
  <div class="seller-view">
    <div class="seller-container">
      <p class="seller-subtitle">{{seller.name}}</p>
      <div class="seller-score">
        <Star :score="seller.score" size="36" />
        <span class="score-text">({{seller.ratingCount}}) 月售{{seller.sellCount}}单</span>
        <div class="favorite">
          <p class="icon-favorite" :class="{check:favorite}" @click="favoriteSeller"></p>
          <div class="favorite-text">{{favorite ? '已收藏':'未收藏'}}</div>
        </div>
      </div>
      <div class="seller-message">
        <div class="message-item">
          <p class="name">起送价</p>
          <div class="big-font">
            20
            <i class="small-font">元</i>
          </div>
        </div>
        <div class="message-item">
          <p class="name">商家配送</p>
          <div class="big-font">
            {{seller.deliveryPrice}}
            <i class="small-font">元</i>
          </div>
        </div>
        <div class="message-item">
          <p class="name">平均送达时间</p>
          <div class="big-font">
            {{seller.deliveryTime}}
            <i class="small-font">分钟</i>
          </div>
        </div>
      </div>
    </div>
    <WhiteSpace />
    <div class="seller-container">
      <p class="seller-subtitle">公告与活动</p>
      <div class="seller-bulletin">{{seller.bulletin}}</div>
      <ul class="seller-supports" v-if="seller.supports&&seller.supports.length">
        <li v-for="(s,i) in seller.supports" class="seller-list-item" :key="i">
          <span class="supports-icon" :class="supportsClassMap[s.type]"></span>
          <span class="supports-text">{{s.description}}</span>
        </li>
      </ul>
    </div>
    <WhiteSpace />
    <div class="seller-container">
      <p class="seller-subtitle">商家实景</p>
      <div class="seller-pics-wrapper" ref="picsWrapper">
        <ul
          class="seller-pics-container"
          :style="{width: seller.pics.length * 126 - 6 +'px',height:'90px'}"
        >
          <li v-for="(p,i) in seller.pics" class="seller-pics-item" :key="i">
            <img class="auto-img" :src="p" />
          </li>
        </ul>
      </div>
    </div>
    <WhiteSpace />
    <div class="seller-container">
      <p class="seller-subtitle">商家信息</p>
      <ul class="seller-info-list">
        <li v-for="(s,i) in seller.infos" class="seller-list-item" :key="i">
          <span class="supports-text">{{s}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import WhiteSpace from "../components/WhiteSpace";
import Star from "../components/Star";

export default {
  props: {
    seller: {
      type: Object,
      required: true
    },
    supportsClassMap: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      favorite: false
    };
  },
  components: {
    WhiteSpace,
    Star
  },
  methods: {
    testSellerIsFavorite() {
      let storage = window.localStorage;
      // 通过localStorage拿到所有已收藏的店家
      let result = storage.getItem("favorite-seller");
      // 用户有没有收藏过商家
      if (result) {
        let arr = JSON.parse(result); // 字符串转数组
        // 判断用户收藏的商铺中是否包含当前商铺
        let item = arr.find(n => n === this.seller.name);
        this.favorite = item ? true : false;
      } else {
        this.favorite = false;
      }
    },
    favoriteSeller() {
      let storage = window.localStorage;
      // 获取原来已经收藏的商家
      let result = storage.getItem("favorite-seller");
      // localStorage存储的数据是字符串，需要将字符串转化成js对象或者数组
      if (this.favorite) {
        // 取消收藏
        result = JSON.parse(result);

        result = result.filter(name => name !== this.seller.name);
      } else {
        if (result) {
          // favorite-seller 已经存放其他商家
          result = JSON.parse(result);
          result = [...result, this.seller.name];
        } else {
          result = [this.seller.name];
        }
      }
      storage.setItem("favorite-seller", JSON.stringify(result));
      this.testSellerIsFavorite();
    }
  },
  watch: {
    seller(newValue, oldValue) { // 当商家发生改变时，重新判断店铺是否收藏
        if(newValue.name !== oldValue.name) {
            this.testSellerIsFavorite()
        }
    }
  },
  beforeMount() {
    this.testSellerIsFavorite();
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.picScroll) {
        this.picScroll = new BScroll(this.$refs.picsWrapper, {
          scrollX: true,
          bounce: false
        });
      } else {
        this.picScroll.refresh();
      }
    });
  },
  beforeDestroy() {
    if (this.picScroll) {
      this.picScroll.destroy();
      this.picScroll = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/mixin";

.seller-container {
  padding: 18px;
  background: #fff;
  .seller-subtitle {
    font-size: 14px;
    line-height: 14px;
    color: rgb(7, 17, 27);
  }

  .seller-score {
    position: relative;
    margin: 8px 0 18px;
    height: 18px;
    font-size: 10px;
    vertical-align: top;
    color: rgb(77, 85, 93);

    .score-text {
      margin-left: 8px;
      display: inline-block;
      height: 18px;
      line-height: 18px;
    }

    .favorite {
      position: absolute;
      right: 0;
      bottom: 0;
    }

    .icon-favorite {
      margin-bottom: 4px;
      font-size: 24px;
      line-height: 24px;
      text-align: center;
      color: rgb(77, 85, 93);
      &.check {
        color: rgb(240, 20, 20);
      }
    }

    .favorite-text {
      font-size: 10px;
      line-height: 10px;
      color: rgb(77, 85, 93);
    }
  }

  .seller-message {
    padding-top: 18px;
    display: flex;
    border-top: 1px solid rgba(7, 17, 27, 0.1);

    .message-item {
      flex: 1;
      text-align: center;
      border-right: 1px solid rgba(7, 17, 27, 0.1);

      &:last-child {
        border-right: 0;
      }
    }

    .name {
      margin-bottom: 4px;
      font-size: 10px;
      line-height: 10px;
      color: rgb(147, 153, 159);
    }

    .big-font {
      font-size: 24px;
      font-weight: 200;
      line-height: 24px;
      color: rgb(7, 17, 27);
    }

    .small-font {
      font-size: 10px;
    }
  }

  .seller-bulletin {
    margin-top: 8px;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 200;
    line-height: 24px;
    color: rgb(240, 20, 20);
  }

  .seller-pics-wrapper {
    width: 100%;
    margin-top: 12px;
    height: 90px;
    overflow: hidden;

    .seller-pics-container {
      white-space: nowrap;
      height: 100%;
    }

    .seller-pics-item {
      display: inline-block;
      width: 120px;
      height: 100%;
      margin-right: 6px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .seller-supports {
    margin-top: 16px;
    font-size: 0;
  }

  .seller-info-list {
    margin-top: 12px;
  }

  .seller-list-item {
    padding: 16px 12px;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
    line-height: 16px;
    font-size: 12px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    @include support-icon("../assets/img", 4, 16px 16px);

    &:last-child {
      padding-bottom: 0;
    }

    .supports-icon {
      display: inline-block;
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }

    .supports-text {
      display: inline-block;
      height: 16px;
      vertical-align: top;
      white-space: nowrap;
    }
  }
}
</style>