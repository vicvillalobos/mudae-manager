<template>
  <div class="character-card-container" @click.stop="showModal">
    <div class="character-card" :class="{ divorcing }">
      <div
        class="image"
        :style="'background-image:url(\' ' + characterImage + ' \')'"
      >
        <img src="/spinner.gif" class="loading-spinner" v-if="isLoading" />
        <div class="action-icons">
          <div class="action-icon" title="Remove" @click.stop="removeCharacter">
            <i class="bi bi-trash"></i>
          </div>
          <div
            class="action-icon divorce"
            :title="
              divorcing ? 'Remove from divorce list' : 'Add to divorce list'
            "
            @click.stop="divorceCharacter"
          >
            <i
              class="bi"
              :class="divorcing ? 'bi-heartbreak-fill' : 'bi-heartbreak'"
            ></i>
          </div>
        </div>
        <div class="loadingText" v-if="loading">Cargando...</div>
        <div class="text" v-if="!loading">
          {{ character.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Libraries
import { ref, computed, onMounted } from "vue";
import ColorThief from "colorthief";
import hsv from "rgb-hsv";
// Models
import Character from "../models/character";
export default {
  props: {
    character: {
      type: Object,
      default: () => {
        return new Character("", "", "");
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    divorcing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const isLoading = ref(false);
    const modalActive = ref(false);
    const modalShown = ref(false);
    const modalFlipped = ref(false);
    const characterPalette = ref(null);
    const editForm = ref({
      name: "",
      series: "",
      image: "",
    });
    const currentTab = ref(0);
    const charImgTag = ref(null);
    const editFormStart = function () {
      if (props.loading) return;
      modalFlipped.value = true;
      editForm.value = {
        name: props.character.name,
        series: props.character.series,
        image: props.character.image,
      };
    };
    const showModal = async function () {
      isLoading.value = true;
      ctx.emit("show-modal", props.character);
      setTimeout(() => {
        isLoading.value = false;
      }, 2000);
    };
    const hideModal = function () {
      ctx.emit("hide-modal");
    };

    const characterImage = computed(() => {
      if (props.character.image.length <= 0)
        return (
          "https://via.placeholder.com/200x350&text=" +
          props.character.name.replaceAll(" ", "+")
        );
      return props.character.image;
    });

    const removeCharacter = function () {
      console.log("remove character");
      ctx.emit("delete-character", props.character);
    };

    const divorceCharacter = function () {
      console.log("divorce character");
      ctx.emit("toggle-divorce", props.character);
    };

    return {
      isLoading,
      modalActive,
      modalShown,
      modalFlipped,
      editForm,
      characterImage,
      charImgTag,
      currentTab,
      showModal,
      hideModal,
      editFormStart,
      removeCharacter,
      divorceCharacter,
    };
  },
};
</script>

<style lang="scss">
.character-card {
  position: relative;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05),
    0px 2px 4px rgba(0, 0, 0, 0.1);

  padding: 2px;
  border-radius: 4px;
  margin: 0;
  width: 90px;
  height: calc(90px * 1.75);
  z-index: 98;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s ease-in;
  .image {
    .loading-spinner {
      position: absolute;
      width: 20px;
      top: 50%;
      bottom: 50%;
      left: 50%;
      right: 50%;
      transform: translate(-50%, -50%);
    }
    width: 100%;
    border-radius: 4px;
    background-color: #eee;
    height: calc(90px * 1.75 - 4px);
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    .loadingText {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.8rem;
      color: #aaa;
    }
    .action-icons {
      color: #fff;
      text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);
      font-size: 14px;
      display: flex;
      opacity: 0;
      transition: all 0.2s ease;
      z-index: 50;
      position: relative;
      .action-icon {
        padding: 5px;
        opacity: 0.5;
        transition: all 0.2s ease;
        &:hover {
          opacity: 1;
        }
      }
    }
    .text {
      padding: 0.25em;
      position: absolute;
      bottom: 0;
      width: 100%;
      max-height: 2.5em;
      color: #fff;
      line-height: 1em;
      background-image: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.8),
        rgba(0, 0, 0, 0)
      );
      border-bottom: 0px solid var(--gender-color);
      overflow: hidden;
      border-width: 0px;
      opacity: 0;
      transition: all 0.2s ease;
    }
  }
  &:hover {
    z-index: 99;
    transform: scale(1.2);
    .text {
      opacity: 1;
      border-width: 4px;
    }
    .action-icons {
      opacity: 1;
    }
  }
  &.divorcing {
    background-color: #70188a;
    .image::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #70188a;
      opacity: 0.5;
      z-index: 0;
    }
  }
}
</style>
