<template>
  <div class="series-group">
    <h4
      :title="series.name"
      :style="`max-width:${series.characters.length * 90}px`"
    >
      {{ series.name }}
    </h4>
    <div class="card-list">
      <character-card
        v-for="character in series.characters"
        :key="character.id + character.name"
        :character="character"
        :divorcing="characterInDivorceList(character)"
        @toggle-divorce="addDivorce"
        @delete-character="deleteCharacter"
        @show-modal="showCharacterModal"
      ></character-card>
    </div>
  </div>
</template>

<script>
import CharacterCard from "./CharacterCard.vue";
import Series from "../models/series";
export default {
  props: {
    series: {
      type: Series,
      required: true,
    },
    divorceList: {
      type: Array,
      default: () => [],
    },
  },
  components: { CharacterCard },
  methods: {
    characterInDivorceList(character) {
      return this.divorceList.includes(character);
    },
    showCharacterModal(character_data) {
      this.$emit("show-modal", character_data);
    },
    addDivorce(character) {
      this.$emit("toggle-divorce", character);
    },
    deleteCharacter(character) {
      this.$emit("delete-character", character);
    },
  },
};
</script>

<style lang="scss">
#app {
  .series-group {
    position: relative;

    .card-list {
      display: flex;
      column-gap: 5px;
      row-gap: 15px;
      flex-direction: row;
      flex-wrap: wrap;
    }
    h4 {
      width: 100%;
      height: 1em;
      overflow: hidden;
      word-break: break-word;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 12px;
      margin: 0;
      margin-bottom: 5px;
    }
  }
}
</style>
