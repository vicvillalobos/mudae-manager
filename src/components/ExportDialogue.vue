<template>
  <div class="export-modal-wrapper" :class="{ active }">
    <div class="modal-box">
      <p>{{ helpText }}</p>
      <p v-if="isHtml" v-html="exportText" class="export"></p>
      <p v-else class="export">{{ exportText }}</p>
      <div class="actions">
        <button @click.prevent="cancel">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exportText: "",
      isHtml: false,
      helpText: "",
      active: false,
    };
  },
  methods: {
    showModal(text, helpText = "", html = false) {
      this.active = true;
      this.isHtml = html;
      this.exportText = text;
      this.helpText = helpText;
    },
    cancel() {
      this.active = false;
      this.exportText = "";
    },
  },
};
</script>

<style lang="scss">
.export-modal-wrapper {
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
    max-height: 90vh;
    p.export {
      font-size: 14px;
      font-family: "Courier New", Courier, monospace;
      background-color: rgb(9, 24, 68);
      color: #fff;
      padding: 1em;
      border-radius: 4px;
      max-height: 40vh;
      overflow: auto;
      text-align: left;
    }
    .actions {
      display: flex;
      justify-content: center;
      column-gap: 1em;
    }
  }
}
</style>
