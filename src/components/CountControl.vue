<template>
  <div class="count-control">
    <transition name="scroll">
      <i @click="minusCount" v-show="count>0" class="control-btn icon-remove_circle_outline"></i>
    </transition>
    <transition name="fade">
      <span class="control-count" v-show="count>0">{{count}}</span>
    </transition>
    <i @click="addCount" class="control-btn icon-add_circle"></i>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      required: true
    }
  },
  computed: {
    count() {
        return this.food.count || 0
    }
  },
  methods: {
    addCount() {
      this.$emit('addCount',this.food)
    },

    minusCount() {
      if (this.count === 0) {
        return;
      }
      this.$emit('minusCount',this.food)
    }
  }
};
</script>

<style lang="scss" scoped>
.count-control {
  width: 72px;
  text-align: right;

  .control-count,
  .control-btn {
    display: inline-block;
    width: 24px;
    line-height: 24px;
    text-align: center;
    vertical-align: top;
  }

  .control-btn {
    font-size: 24px;
    color: rgb(0, 160, 220);

    &.scroll-enter,
    &.scroll-leave-to {
      transform: translateX(48px) rotate(180deg);
      opacity: 0;
    }

    &.scroll-enter-active,
    &.scroll-leave-active {
      transition: all 0.3s linear;
    }

    &.scroll-enter-to,
    &.scroll-leave {
      transform: translateX(0) rotate(0deg);
      opacity: 1;
    }
  }

  .control-count {
    font-size: 10px;
    color: rgb(147, 153, 159);

    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
    }

    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity 0.3s linear;
    }

    &.fade-enter-to,
    &.fade-leave {
      opacity: 1;
    }
  }
}
</style>