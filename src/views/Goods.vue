<template>
  <div class="goods-view">
    <div class="goods-container" :style="{height}" ref="goodsContainer">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            v-for="(good,i) in goods"
            class="menu-list"
            :key="i"
            :class="{active: currentIndex=== i}"
            @click="scrollToCurrentGoodList(i)"
          >
            <div class="menu-item">
              <span class="menu-context">
                <i v-if="good.type > 0" class="menu-icon" :class="supportsClassMap[good.type]"></i>
                {{good.name}}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="goods-wrapper" ref="goodsWrapper">
        <ul>
          <!-- v-for 与 ref一起使用时 ref会返回一个DOM数组 -->
          <li v-for="(good,i) in goods" :key="i" ref="goodList">
            <h3 class="goods-subtitle">{{good.name}}</h3>
            <ul class="foods-list">
              <li v-for="food in good.foods" :key="food.name" class="food-item">
                <div class="food-icon">
                  <img :src="food.icon" class="auto-img" />
                </div>
                <div class="food-content">
                  <h3 class="food-name">{{food.name}}</h3>
                  <p class="food-desc" v-if="food.description">{{food.description}}</p>
                  <p class="food-desc">月售{{food.sellCount}}份 好评率{{food.rating}}%</p>
                  <div class="food-price">
                    ¥{{food.price}}
                    <span class="old-price" v-if="food.oldPrice">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="control-wrapper">
                    <CountContrl :food="food" @addCount="addCount" @minusCount="minusCount" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="shopcart">
      <ShopCart
        :shopcartList="shopcartList"
        :seller="seller"
        @empty="emptyFoods"
        @addCount="addCount"
        @minusCount="minusCount"
      />
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import CountContrl from "../components/CountControl";
import ShopCart from "../components/ShopCart";

export default {
  props: {
    supportsClassMap: {
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
      goods: [],
      height: "50vh",
      loading: false,
      currentIndex: 0
    };
  },
  computed: {
    shopcartList() {
      let result = [];
      this.goods.forEach(g => {
        g.foods.forEach(f => {
          if (f.count) {
            // 商品数量大于0
            let food = result.find(item => item.name === f.name);
            // result数组是否已经添加过同名商品，商品去重
            if (!food) {
              result.push(f);
            }
          }
        });
      });
      return result;
    }
  },
  methods: {
    initalScroll() {
      if (!this.menuScroller) {
        // 避免内存泄漏，当menuScroller已经被创建时无需再实例化新的BScroll对象
        this.menuScroller = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
      } else {
        this.menuScroller.refresh();
      }

      if (!this.goodsScroller) {
        // 避免内存泄漏，当goodsScroller已经被创建时无需再实例化新的BScroll对象
        this.goodsScroller = new BScroll(this.$refs.goodsWrapper, {
          click: true,
          probeType: 2 // 设置BScroll探针，当用户滑动商品列表是触发，当前商品的scroll事件
        });

        // 添加滚动监听,实现滚动到指定区商品域后对应菜单高亮
        this.goodsScroller.on("scroll", this.refreshMenuScrollCurrentIndex);
      } else {
        this.goodsScroller.refresh();
      }
    },
    refreshMenuScrollCurrentIndex() {
      let result = 0;
      // 这个li距离屏幕上方-174px(header高174)后取值为0 ～ 自身高度之间，代表当前用户正在访问这个li,
      for (let i = 0; i < this.$refs.goodList.length; i++) {
        let { top, height } = this.$refs.goodList[i].getBoundingClientRect();

        top = Math.ceil(-(top - 174));

        if (i === 0 && top < 0) {
          // 减少第一个食品的弹簧效果遍历次数
          break;
        }

        if (top >= 0 && top <= height) {
          result = i;
          break;
        }
      }
      console.log(result);
      this.currentIndex = result;
    },
    destroyScroll() {
      if (this.menuScroller) {
        this.menuScroller.destroy();
        this.menuScroller = null;
      }

      if (this.goodsScroller) {
        this.goodsScroller.destroy();
        this.goodsScroller = null;
      }
    },
    scrollToCurrentGoodList(index) {
      let goodList = this.$refs.goodList[index];
      //   console.log(this.$refs.goodList)
      this.goodsScroller.scrollToElement(goodList, 300);
      this.currentIndex = index;
    },
    addCount(food) {
      this.goods.forEach(good => {
        let f = good.foods.find(f => f.name === food.name);
        if (f) {
          if (!f.count) {
            this.$set(f, "count", 1);
          } else {
            f.count++;
          }
        }
      });
    },
    minusCount(food) {
      this.goods.forEach(good => {
        let f = good.foods.find(f => f.name === food.name);
        if (f) {
          f.count--;
        }
      });
    },
    emptyFoods() {
      this.goods.forEach(good => {
        good.foods.forEach(f => {
          if (f.count) {
            // 将有数量的商品清空
            f.count = 0;
          }
        });
      });
    }
  },
  components: {
    CountContrl,
    ShopCart
  },
  mounted() {
    // 获取商品区域容器高度，屏幕高度 - 元素距离顶部的高度 - 购物车的高度
    this.height =
      screen.availHeight -
      this.$refs.goodsContainer.getBoundingClientRect().top -
      48 +
      "px";

    this.loading = true; // 表示正在请求
    let { CancelToken } = this.axios;
    this.axios
      .get("/api/goods", {
        timeout: 5000,
        cancelToken: new CancelToken(c => {
          // 函数接收一个 cancel 函数作为参数
          this.axiosCancel = c;
        })
      })
      .then(res => {
        this.goods = res.data.data;
        this.loading = false;
        // 网络请求请求数据成功后，等待页面更新完毕初始化BetterScroll
        this.$nextTick(() => {
          this.initalScroll();
        });
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  },
  beforeDestroy() {
    this.destroyScroll();
    //todo: 在真实开发中这里可以取消网络请求
    if (this.loading) {
      // 页面将要销毁，但是网络请求还没结束
      this.axiosCancel(); // 销毁当前网络请求
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/mixin";

.goods-container {
  display: flex;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    height: 100%;
    overflow: hidden;
    background: #f3f5f7;
    .menu-list {
      padding: 0 12px;
      height: 54px;
      font-weight: 200;
      &.active {
        position: relative;
        top: -1px;
        background: #fff;
        font-weight: normal;
        .menu-item {
          border-bottom: 0;
        }
      }
    }

    .menu-item {
      display: table;
      width: 100%;
      height: 100%;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      font-size: 12px;
      line-height: 14px;
      color: rgb(7, 17, 27);
    }

    .menu-context {
      display: table-cell;
      vertical-align: middle;
    }

    .menu-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: top;
    }

    @include support-icon("../assets/img", 3, 12px 12px);
  }

  .goods-wrapper {
    flex: 1;
    height: 100%;
    overflow: hidden;

    .goods-subtitle {
      padding-left: 14px;
      height: 26px;
      border-left: 2px solid #d9dde1;
      line-height: 26px;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .foods-list {
      padding: 0 18px;
      background: #fff;

      .food-item {
        display: flex;
        padding: 18px 0;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border-bottom: 0; /* css规范如果不设置边框 不能用none而是要用0 */
        }
      }

      .food-icon {
        margin-right: 10px;
        flex: 0 0 57px;
        width: 57px;
        height: 57px;
        border-radius: 2px;
        overflow: hidden;
      }

      .food-content {
        flex: 1;
        position: relative;
      }

      .food-name {
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }

      .food-desc {
        margin-top: 8px;
        font-size: 10px;
        line-height: 10px;
        color: rgb(147, 153, 159);
      }

      .food-price {
        font-size: 14px;
        font-weight: 700;
        line-height: 24px;
        color: rgb(240, 20, 20);
        &:first-letter {
          font-size: 10px;
          font-weight: 200;
        }
      }

      .old-price {
        font-size: 10px;
        font-weight: normal;
        color: rgb(147, 153, 159);
        text-decoration: line-through;
      }

      .control-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>