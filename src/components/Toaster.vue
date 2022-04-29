<template>
  <div class="toaster">
    <TransitionGroup name="list" tag="div" class="toasts">
      <div class="vtoast" v-for="(toast, index) in toasts" :key="index">
        <div class="toast-content">
          <div class="toast-icon">
            <i :class="'bi-' + toast.icon"></i>
          </div>
          <div class="toast-text">
            {{ toast.text }}
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { state, addToast } from "../stores/toast";
export default {
  data() {
    return {
      timeout: 5000,
    };
  },
  methods: {
    addToast(text, icon) {
      addToast(text, icon, timeout);
    },
  },
  computed: {
    toasts() {
      return state.value.toasts;
    },
  },
};
</script>

<style lang="scss">
.toaster {
  position: fixed;
  top: 1em;
  right: 2em;
  z-index: 999;
  .toasts {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    row-gap: 0.5em;
    justify-content: flex-start;
    .vtoast {
      min-width: 300px;
      min-height: 2em;
      background-color: rgba(255 255 255 / 90%);
      padding: 1em 2em;
      border-radius: 4px;
      backdrop-filter: blur(5px);
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05),
        0px 2px 4px rgba(0, 0, 0, 0.1);
      .toast-content {
        display: flex;
        .toast-icon {
          margin-right: 1em;
        }
      }
    }
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
