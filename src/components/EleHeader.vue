<template>
  <div class="ele-header">
    <div class="ele-header-container">
      <div class="ele-header-avatar">
        <img :src="seller.avatar" class="auto-img" alt="seller avatar" />
      </div>
      <div class="ele-header-content">
        <h2 class="ele-header-name">
          <span class="ele-header-brand"></span>
          {{seller.name}}
        </h2>
        <div class="ele-header-desc">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div class="ele-header-supports">
          <transition-group name="roll">
            <p
              v-for="(s,i) in seller.supports"
              v-show="index === i"
              class="support-item"
              :key="s.type"
            >
              <span :class="supportsClassMap[s.type]" class="support-icon"></span>
              {{s.description}}
            </p>
          </transition-group>
        </div>
        <div
          class="supports-count"
          @click="switchDetail(true)"
          v-if="seller.supports&&seller.supports.length"
        >
          {{seller.supports.length}}个
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="ele-header-bulletin" @click="switchDetail(true)">
      <span class="bulletin-icon"></span>
      {{seller.bulletin}}
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="ele-header-bg">
      <img :src="seller.avatar" width="100%" />
    </div>
    <transition name="fade">
      <div class="ele-header-detail" v-show="showDetail">
        <div class="ele-header-detail-container">
          <h2 class="detail-name">{{seller.name}}</h2>
          <div class="star-wrapper">
            <Star :score="seller.score" />
          </div>
          <div class="detail-title" v-if="seller.supports && seller.supports.length">
            <div class="detail-title-line"></div>
            <div class="detail-title-text">优惠信息</div>
            <div class="detail-title-line"></div>
          </div>
          <ul class="detail-supports">
            <li v-for="(support,i) in seller.supports" class="detail-supports-item" :key="i">
              <span class="detail-supports-icon" :class="supportsClassMap[support.type]" />
              {{support.description}}
            </li>
          </ul>
          <div class="detail-title">
            <div class="detail-title-line"></div>
            <div class="detail-title-text">商家公告</div>
            <div class="detail-title-line"></div>
          </div>
          <p class="detail-bulletin">{{seller.bulletin}}</p>
        </div>
        <div class="close-wrapper">
          <i class="icon-close" @click="switchDetail(false)"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Star from "./Star";

export default {
  props: {
    seller: {
      type: Object,
      required: true
    },
    supportsClassMap: {
      type: Array
    }
  },
  data() {
    return {
      index: 0,
      showDetail: false
    };
  },
  methods: {
    switchDetail(show) {
      this.showDetail = show;
    }
  },
  watch: {
    seller(newVal) {
      if (newVal.supports && newVal.supports.length > 0) {
        // 等待页面渲染完毕
        this.$nextTick(() => {
          clearInterval(this.timer); //关闭上一次计时器
          // 开启下一次计时器
          this.timer = setInterval(() => {
            if (this.index >= newVal.supports.length - 1) {
              this.index = 0;
            } else {
              this.index++;
            }
          }, 1000);
        });
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  components: {
    Star
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/mixin";
.ele-header {
  position: relative;
  background: rgba(7, 17, 27, 0.5);
  overflow: hidden;
}
.ele-header-container {
  display: flex;
  padding: 24px 12px 18px 24px;

  .ele-header-avatar {
    flex: 0 0 64px;
    margin-right: 16px;
    width: 64px;
    height: 64px;
    border-radius: 2px;
    overflow: hidden;
  }

  .ele-header-content {
    flex: 1;
    position: relative;

    .ele-header-brand {
      display: inline-block;
      margin-right: 6px;
      width: 30px;
      height: 18px;
      vertical-align: top;
      @include bg-image("../assets/img/brand", 30px 18px);
    }

    .ele-header-name {
      font-size: 16px;
      font-weight: bold;
      line-height: 18px;
      color: #fff;
    }

    .ele-header-desc {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 200;
      line-height: 12px;
      color: #fff;
    }

    .ele-header-supports {
      margin-top: 10px;
      position: relative;
      height: 12px;
      overflow: hidden;
    }

    .support-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: top;
    }

    .support-item {
      position: absolute;
      font-size: 10px;
      line-height: 12px;
      font-weight: 200;
      color: #fff;
      @include support-icon("../assets/img", 1, 12px 12px);

      &.roll-enter {
        transform: translateY(-13px);
      }

      &.roll-enter-active,
      &.roll-leave-active {
        transition: all 0.5s linear;
      }

      &.roll-enter-to,
      &.roll-leave {
        transform: translateY(0);
      }

      &.roll-leave-to {
        transform: translateY(13px);
      }
    }

    .supports-count {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 7px 8px;
      border-radius: 13px;
      font-size: 10px;
      line-height: 12px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
    }
  }
}

.ele-header-bulletin {
  position: relative;
  padding: 8px 12px;
  height: 28px;
  background: rgba(7, 17, 27, 0.2);
  line-height: 12px;
  font-size: 10px;
  font-weight: 200;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .bulletin-icon {
    display: inline-block;
    margin-right: 4px;
    width: 22px;
    height: 12px;
    @include bg-image("../assets/img/bulletin", 22px 12px);
    vertical-align: top;
  }

  .icon-keyboard_arrow_right {
    position: absolute;
    right: 10px;
  }
}

.ele-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  filter: blur(10px);
}

.ele-header-detail {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  background: rgba(7, 17, 27, 0.8);
  backdrop-filter: blur(10px);
  z-index:99;

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }

  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.5s linear;
  }

  &.fade-enter-to,
  &.fade-leave {
    opacity: 1;
  }

  .ele-header-detail-container {
    min-height: 100vh;
    padding: 64px 32px;
    color: #fff;
    @include support-icon("../assets/img", 2, 16px 16px);

    .detail-name {
      font-weight: 700;
      font-size: 16px;
      line-height: 16px;
      text-align: center;
    }

    .star-wrapper {
      margin-top: 16px;
      text-align: center;
    }

    .detail-title {
      margin: 28px 0 24px;
      display: flex;
    }

    .detail-title-line {
      flex: 1;
      transform: translateY(-6.5px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .detail-title-text {
      margin: 0 12px;
      font-weight: 700;
      font-size: 14px;
      line-height: 14px;
    }

    .detail-bulletin {
      padding: 0 12px;
      font-weight: 200;
      font-size: 12px;
      line-height: 24px;
    }

    .detail-supports {
      padding: 0 12px;
      font-weight: 200;
      font-size: 12px;
      line-height: 16px;
    }

    .detail-supports-item {
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .detail-supports-icon {
      display: inline-block;
      margin-right: 6px;
      width: 16px;
      height: 16px;
      vertical-align: top;
    }
  }
  .close-wrapper {
    position: absolute;
    bottom: 32px;
    left: 0;
    right: 0;
    font-size: 32px;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>