<template>
  <div class="mmas-modal-wrapper" :class="{ active }">
    <div class="modal-box">
      <p>Paste the contents of your <code>$mm</code> command. This will remove characters and add new ones.</p>
      <p>Recommended command: <code>$mmai-sky+</code> <br/>Required flags: <code>s</code>, <code>a</code>. Compatible flags: <code>i-</code>, <code>y+</code> and <code>k</code></p>
      <textarea v-model="mmasInput"></textarea>
      <div class="actions">
        <button class="btn btn-primary" @click.prevent="confirm">Start</button>
        <button class="btn btn-secondary" @click.prevent="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      mmasInput: "",
    };
  },
  methods: {
    showModal() {
      this.active = true;
    },
    confirm() {
      this.$emit("execute-mmas", this.mmasInput);
      this.active = false;
    },
    cancel() {
      this.active = false;
    },
  },
};
</script>

<style lang="scss">
.mmas-modal-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0 0 0 / 60%);
  z-index: 200;
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
    text-align: left;
    p {
      font-size: 0.8rem;
      font-weight: 300;
      margin:0;
      margin-bottom:0.8em;
    }
    textarea {
      margin-bottom: 1em;
    }
    .actions {
      display: flex;
      justify-content: center;
      column-gap: 1em;
    }
  }
}
</style>
