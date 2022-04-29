<template>
  <div class="tiers-page">
    <p>Drag and drop characters into their desired tier.</p>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier S</h3>
      </div>
      <draggable
        class="charlist"
        v-model="tierS"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier A</h3>
      </div>
      <draggable
        class="charlist"
        v-model="tierA"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier B</h3>
      </div>
      <draggable
        class="charlist"
        v-model="tierB"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier C</h3>
      </div>
      <draggable
        class="charlist"
        v-model="tierC"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier D</h3>
      </div>
      <draggable
        class="charlist"
        v-model="tierD"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier F</h3>
      </div>
      <draggable
        class="charlist"
        :list="tierF"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Unranked</h3>
      </div>
      <draggable
        class="charlist"
        :list="noRank"
        @start="drag = true"
        @end="drag = false"
        group="tiers"
        item-key="index"
      >
        <template #item="{ element, index }">
          <character-card
            :data-index="index"
            :character="element"
          ></character-card>
        </template>
      </draggable>
    </div>
    <div class="actions">
      <button @click="save">Save</button>
    </div>
  </div>
</template>

<script>
import Character from "../models/character";
import draggable from "vuedraggable";
import CharacterCard from "../components/CharacterCard.vue";
import { addToast } from "../stores/toast";
export default {
  components: {
    draggable,
    CharacterCard,
  },
  data() {
    return {
      tierS: [],
      tierA: [],
      tierB: [],
      tierC: [],
      tierD: [],
      tierF: [],
      noRank: [],
      drag: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const data = localStorage.getItem("v-mudae-ranking-characters");
      if (data) {
        const decoded = decodeURIComponent(atob(data));
        const char_list = JSON.parse(decoded);
        char_list.forEach((character_data) => {
          const char = Character.FromJson(character_data);
          switch (char.tier) {
            default:
              this.noRank.push(char);
              break;
            case "S":
              this.tierS.push(char);
              break;
            case "A":
              this.tierA.push(char);
              break;
            case "B":
              this.tierB.push(char);
              break;
            case "C":
              this.tierC.push(char);
              break;
            case "D":
              this.tierD.push(char);
              break;
            case "F":
              this.tierF.push(char);
              break;
          }
        });
      } else {
        console.log("no data found in storage");
      }
    },
    // Save character data to local storage
    save(notify = true) {
      const charListJson = [];

      // Set character Tiers
      this.tierS.forEach((character) => {
        character.SetTier("S");
        charListJson.push(character.toJson());
      });
      this.tierA.forEach((character) => {
        character.SetTier("A");
        charListJson.push(character.toJson());
      });
      this.tierB.forEach((character) => {
        character.SetTier("B");
        charListJson.push(character.toJson());
      });
      this.tierC.forEach((character) => {
        character.SetTier("C");
        charListJson.push(character.toJson());
      });
      this.tierD.forEach((character) => {
        character.SetTier("D");
        charListJson.push(character.toJson());
      });
      this.tierF.forEach((character) => {
        character.SetTier("F");
        charListJson.push(character.toJson());
      });
      this.noRank.forEach((character) => {
        character.ClearTier();
        charListJson.push(character.toJson());
      });

      localStorage.setItem(
        "v-mudae-ranking-characters",
        btoa(encodeURIComponent(JSON.stringify(charListJson)))
      );
      if (notify) addToast("Changes saved", "save");
    },
  },
};
</script>

<style lang="scss">
.tierlist {
  .charlist {
    min-height: 50px;
  }
}
</style>
