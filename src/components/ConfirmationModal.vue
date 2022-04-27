<template>
  <div class="confirmation-modal-wrapper" :class="{ active }">
    <div class="modal-box">
      <p v-html="text"></p>
      <div class="actions">
        <button @click.prevent="confirm">{{ confirmText }}</button>
        <button @click.prevent="cancel">{{ cancelText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "Are you sure?",
    },
    confirmText: {
      type: String,
      default: "Delete",
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss">
.confirmation-modal-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0 0 0 / 60%);
  z-index: 99;
  overflow: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  backdrop-filter: blur(5px);
  opacity: 0;
  &.active {
    opacity: 1;
    pointer-events: all;
  }
  .modal-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(500px, 100%);
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05),
      0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2em;
    transition: all 0.2s ease;
    text-align: center;
    p {
      font-size: 14px;
    }
    .actions {
      display: flex;
      justify-content: center;
      column-gap: 1em;
    }
  }
}
</style>
