<template>
  <div class="rating-control">
    <div class="rating-select">
      <span
        class="option positive"
        @click="selectOption(0)"
        :class="{active: selected === 0}"
      >{{all}} {{ratingCount.all}}</span>
      <span
        class="option positive"
        @click="selectOption(1)"
        :class="{active: selected === 1}"
      >{{positive}} {{ratingCount.positive}}</span>
      <span
        class="option negative"
        @click="selectOption(2)"
        :class="{active: selected === 2}"
      >{{negative}} {{ratingCount.negative}}</span>
    </div>
    <div class="rating-filter">
      <p class="filter-label" :class="{active: onlyContent}" @click="$emit('toggle-only-content')">
        <i class="icon-check_circle"></i>
        <span class="label-text">只看有内容的评价</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    all: {
      type: String,
      default: "全部"
    },
    positive: {
      type: String,
      default: "满意"
    },
    negative: {
      type: String,
      default: "不满意"
    },
    selected: {
      type: Number,
      default: 0
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    ratings: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ratingCount() {
      let positive = 0;
      let negative = 0;
      this.ratings.forEach(r => {
        if (r.rateType === 0) {
          positive++;
        } else {
          negative++;
        }
      });

      return {
        all: this.ratings.length,
        positive,
        negative
      };
    }
  },
  methods: {
    selectOption(option) {
      this.$emit("select-option", option);
    }
  }
};
</script>

<style lang="scss" scoped>
.rating-control {
  padding: 0 18px;
  background: #fff;
  border-bottom: 2px solid rgba(7, 17, 27, 0.1);

  .rating-select {
    padding: 18px 0;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);

    .option {
      margin-right: 8px;
      padding: 8px 12px;
      border-radius: 2px;
      font-size: 12px;
      background: #eee;

      &:last-child {
        margin-right: 0;
      }

      &.positive {
        background: rgba(0, 160, 220, 0.2);

        &.active {
          color: #fff;
          background: rgb(0, 160, 220);
        }
      }

      &.negative {
        background: rgba(77, 85, 93, 0.2);
        &.active {
          color: #fff;
          background: rgb(77, 85, 93);
        }
      }
    }
  }

  .rating-filter {
    padding: 12px 0;

    .filter-label {
      display: inline-block;
      font-size: 12px;
      line-height: 24px;
      color: rgb(147, 153, 159);

      &.active {
        color: rgb(77, 85, 93);
        .icon-check_circle {
          color: rgb(4, 168, 67);
        }
      }
    }

    .label-text {
      display: inline-block;
      vertical-align: top;
    }
    .icon-check_circle {
      margin-right: 4px;
      font-size: 24px;
    }
  }
}
</style>