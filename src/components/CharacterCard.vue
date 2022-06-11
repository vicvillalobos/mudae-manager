<template>
  <div class="character-card-container" @click.stop="showModal">
    <div class="character-card" :class="{ selected }">
      <div
        class="image"
      >
        <div class="characterGIF" :style="'background-image:url(\' ' + characterMudaeImage + ' \')'" v-if="characterMudaeImage.length > 0" ></div>
        <div class="characterGIF" :style="'background-image:url(\' ' + characterImage + ' \')'" v-else></div>
        <div class="characterStill" :style="'background-image:url(\' ' + characterImage + ' \')'" ></div>
        <img src="/spinner.gif" class="loading-spinner" v-if="isLoading" />
        <div class="action-icons">
          <div class="action-icon action-select" title="Seleccionar" @click.stop="selectCharacter">
            <i class="bi" :class="{'bi-square-fill': !selected, 'bi-check-square-fill': selected}"></i>
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
import { ref, computed, onMounted, inject } from "vue";

// Models
import Character from "../models/character";
export default {
  props: {
    character: {
      type: Object,
      default: () => {
        return new Character(null, "", "", "");
      },
    },
    selected: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const emitter = inject('emitter');
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
      emitter.emit('show-character-card', props.character.uuid);
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

    const characterMudaeImage = computed(() => {
      if (props.character.mudaeImage.length <= 0)
        return "";
      return props.character.mudaeImage;
    })

    const selectCharacter = function () {
      ctx.emit("character-selected", props.character.uuid);
    };

    return {
      isLoading,
      modalActive,
      modalShown,
      modalFlipped,
      editForm,
      characterImage,
      characterMudaeImage,
      charImgTag,
      currentTab,
      showModal,
      hideModal,
      editFormStart,
      selectCharacter,
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
    position:relative;
    .characterGIF {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      display: none;
      position:absolute;
      top:0;
      left:0;
    }
    .characterStill {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      opacity:1;
      position:absolute;
      top:0;
      left:0;
      transition:opacity 0s ease-in;
    }
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
        opacity: 1;
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
      transition: all 0.1s ease;
    }
  }
  &:hover {
    z-index: 99;
    transform: scale(1.05);
    .image {
      .characterGIF {
        display:block;
      }
      .characterStill {
        opacity:0;
        transition:opacity 0.2s ease-in;
      }
    }
    .text {
      opacity: 1;
      border-width: 4px;
    }
    .action-icons {
      opacity: 1;
    }
  }
  &.selected {
    background-color: rgb(0, 132, 255);

    .action-icons {
      opacity: 1;
      .action-select {
        opacity: 1;
        .bi {
          color: rgb(0, 132, 255);
        }
      }
    }
    .image::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      z-index: 0;
    }
  }
}
</style>
