<template>
  <div class="add-character-modal-wrapper" :class="{ active }">
    <div class="modal-box">
      <div class="image">
        <div
          class="img-bg"
          :style="
            'background-image: url(\' ' + characterOrDefault.image + ' \')'
          "
        ></div>
      </div>
      <div class="text">
        <p>Enter the name and series of the character you want to add.</p>
        <div class="form">
          <div class="form-group">
            <label> Character Name </label>
            <input type="text" v-model="characterName" />
            <p v-if="characterOrDefault.canonicalName">
              Character name found: {{ characterOrDefault.canonicalName }}
            </p>
          </div>
          <div class="form-group">
            <label> Series </label>
            <input type="text" v-model="characterSeries" />
            <p v-if="characterOrDefault.series">
              Series found: {{ characterOrDefault.series }}
            </p>
          </div>
          <button @click="searchCharacter">Search</button>
        </div>
        <div class="actions">
          <button @click.prevent="confirm" :disabled="!fetched">
            {{ confirmText }}
          </button>
          <button @click.prevent="cancel">{{ cancelText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Character from "../models/character";

export default {
  props: {
    text: {
      type: String,
      default: "Are you sure?",
    },
    confirmText: {
      type: String,
      default: "Add Character",
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
  },
  data() {
    return {
      character: null,
      characterName: "",
      characterSeries: "",

      active: false,
      fetched: false,
    };
  },
  computed: {
    characterOrDefault() {
      return this.character || new Character("", "", "");
    },
  },
  methods: {
    async searchCharacter() {
      const c = new Character(this.characterName, this.characterSeries);

      const data = await c.FetchDataSearch();

      console.log("character found: ", data);

      c.FillFromFetched(data);

      this.character = c;
      this.fetched = true;
    },
    showModal() {
      this.active = true;
    },
    confirm() {
      if (!this.fetched) return;
      this.$emit("add-character", this.character);
      this.character = null;
      this.fetched = false;
      this.active = false;
    },
    cancel() {
      this.active = false;
    },
  },
};
</script>

<style lang="scss">
.add-character-modal-wrapper {
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
    width: min(700px, 100%);
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
    display: flex;
    .image {
      padding-right: 2em;
      .img-bg {
        width: 200px;
        height: 200px * 1.75;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #eee;
        border-radius: 4px;
      }
    }
    .form {
      width: 80%;
      margin: 1em auto;
      text-align: left;
      .form-group {
        label {
          display: block;
        }
        input {
          width: 100%;
          border-radius: 4px;
          padding: 0.4em 1em;
          border: none;
          box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05),
            0px 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 1em;
          outline: none;
          transition: all 0.2s ease;
          font-weight: 300;
          &:focus {
            box-shadow: 0px 0px 0px 1px rgba(0, 135, 207, 0.3),
              0px 2px 4px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 1em;
      button[disabled] {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }
}
</style>
