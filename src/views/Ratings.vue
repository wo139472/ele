<template>
  <div class="rating-view">
    <div class="rating-view-header">
      <div class="rating-rank">
        <p class="score">{{seller.score}}</p>
        <div class="title">综合评分</div>
        <div class="rank">高于周边商家{{seller.rankRate}}%</div>
      </div>
      <div class="rating-score">
        <div class="rating-text">
          <span class="rating-title">服务态度</span>
          <Star :score="seller.serviceScore" size="36" />
          <span class="score-text">{{seller.serviceScore}}</span>
        </div>
        <div class="rating-text">
          <span class="rating-title">商品评分</span>
          <Star :score="seller.foodScore" size="36" />
          <span class="score-text">{{seller.foodScore}}</span>
        </div>
        <div class="rating-text">
          <span class="rating-title">送达时间</span>
          <span class="rating-desc">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <WhiteSpace />
    <RatingControl
      :selected="selected"
      :onlyContent="onlyContent"
      :ratings="ratings"
      @toggle-only-content="toggleOnlyContent"
      @select-option="selectOption"
    />
    <ul class="rating-wrapper">
      <li v-for="(r,i) in ratingList" :key="i" class="rating-item">
        <div class="rating-avatar">
          <img :src="r.avatar" class="auto-img" />
        </div>
        <div class="rating-content">
          <div class="username">{{r.username}}</div>
          <div class="rating-score">
            <Star size="24" :score="r.score" />
            <span class="text" v-if="r.deliveryTime">{{r.deliveryTime}}分钟送达</span>
          </div>
          <p class="rating-text">{{r.text}}</p>
          <div class="rating-recommend" v-if="r.recommend.length">
            <i :class="r.rateType?'icon-thumb_down':'icon-thumb_up'"></i>
            <span class="label" v-for="(text,index) in r.recommend" :key="index">{{text}}</span>
          </div>
          <div class="rate-time">{{r.rateTime|getDateString}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import WhiteSpace from "../components/WhiteSpace";
import Star from "../components/Star";
import RatingControl from "../components/RatingControl";
import { zeroFill } from "../assets/js/tool";

export default {
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      onlyContent: false,
      selected: 0,
      ratings: []
    };
  },
  computed: {
    ratingList() {
      return this.ratings.filter(r => {
        if (this.onlyContent && !r.text) {
          return false;
        }
        if (this.selected === 1) {
          return r.rateType === 0;
        }

        if (this.selected === 2) {
          return r.rateType === 1;
        }

        return true;
      });
    }
  },
  filters: {
    getDateString(time) {
      let date = new Date(time);
      let y = zeroFill(date.getFullYear());
      let M = zeroFill(date.getMonth() + 1);
      let d = zeroFill(date.getDate());
      let h = zeroFill(date.getHours());
      let m = zeroFill(date.getMinutes());
      return `${y}-${M}-${d} ${h}:${m}`
    }
  },
  methods: {
    selectOption(option) {
      this.selected = option;
    },
    toggleOnlyContent() {
      this.onlyContent = !this.onlyContent;
    }
  },
  components: {
    WhiteSpace,
    Star,
    RatingControl
  },
  mounted() {
    this.axios("/api/ratings").then(res => {
      this.ratings = res.data.data;
      console.log(this.ratings);
    });
  }
};
</script>

<style lang="scss" scoped>
.rating-view-header {
  display: flex;
  padding: 18px 0;

  .rating-rank {
    padding: 0 10px;
    text-align: center;
    .score {
      margin-bottom: 6px;
      line-height: 28px;
      font-size: 24px;
      color: rgb(255, 153, 0);
    }

    .title {
      margin-bottom: 8px;
      line-height: 12px;
      font-size: 12px;
      color: rgb(7, 17, 27);
    }

    .rank {
      margin-bottom: 6px;
      line-height: 10px;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
  }

  .rating-score {
    flex: 1;
    border-left: 1px solid rgba(7, 17, 27, 0.1);

    .rating-text {
      margin: 0 auto;
      margin-bottom: 8px;
      max-width: 90%;
      vertical-align: top;

      &:last-child {
        margin-bottom: 0;
      }

      .rating-title {
        margin-right: 12px;
        font-size: 12px;
        line-height: 18px;
        color: rgb(7, 17, 27);
      }

      .score-text {
        margin-left: 12px;
        font-size: 12px;
        line-height: 18px;
        color: rgb(255, 153, 0);
      }

      .rating-desc {
        font-size: 12px;
        line-height: 18px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
.rating-wrapper {
  padding: 0 18px;
  background: #fff;

  .rating-item {
    display: flex;
    padding: 18px 0;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }

  .rating-avatar {
    flex: 0 0 28px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
  }
  .rating-content {
    position: relative;
    flex: 1;

    .username {
      margin-bottom: 8px;
      font-size: 10px;
      line-height: 12px;
      color: rgb(7, 17, 27);
    }

    .rating-score {
      margin-bottom: 6px;
      font-weight: 200;
      font-size: 10px;
      line-height: 12px;
      color: rgb(147, 153, 159);
    }
    .text {
      display: inline-block;
      margin-left: 6px;
      vertical-align: top;
    }

    .rating-text {
      font-size: 12px;
      line-height: 18px;
      color: rgb(7, 17, 27);
    }

    .icon-thumb_down {
      margin-top: 8px;
      display: inline-block;
      font-size: 12px;
      line-height: 16px;
      color: rgb(183, 187, 191);
    }
    .icon-thumb_up {
      margin-top: 8px;
      display: inline-block;
      font-size: 12px;
      line-height: 16px;
      color: rgb(0, 160, 220);
    }

    .label {
      margin-top: 8px;
      display: inline-block;
      margin-left: 8px;
      padding: 0 6px;
      max-width: 64px;
      border: 1px solid rgba(7, 17, 27, 0.1);
      border-radius: 1px;
      font-size: 9px;
      line-height: 16px;
      color: rgb(147, 153, 159);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: top;
    }

    .rate-time {
        position: absolute;
        top: 0;
        right: 0;
        font-weight: 200;
        font-size: 10px;
        line-height: 12px;
        color: rgb(147, 153, 159);
    }
  }
}
</style>