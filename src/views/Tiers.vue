<template>
  <div class="tiers-page">
    <p>Drag and drop characters into their desired tier.</p>
    <section>
      <div class="v-card action-card" id="claimed-characters-action-bar">
        <div class="row">
          <div class="col-md-1">
            <div class="text-right">
              Action:
            </div>
          </div>
          <div class="col-md-5">
            <select :disabled="selectedCharacters.length <= 0" v-model="actionSelection">
              <option :value="-1">With the selected characters...</option>
              <option :value="1">Move to S tier</option>
              <option :value="2">Move to A tier</option>
              <option :value="3">Move to B tier</option>
              <option :value="4">Move to C tier</option>
              <option :value="5">Move to D tier</option>
              <option :value="6">Move to F tier</option>
              <option :value="7">Remove tier</option>
            </select>
          </div>
          <div class="col-md-1">
            <button class="btn btn-outline-primary" @click.prevent="executeAction">Go</button>
          </div>
          <div class="col-md-5">
            <div class="text">
              {{ selectedCharacters.length }} of {{ claimedCharacterList.length }} characters selected.
              <span v-if="claimedCharacterList.length > selectedCharacters.length">(<a href="#"
                  @click.prevent="selectAll">Select all</a>)</span>
              <span v-else>(<a href="#" @click.prevent="deselectAll">Deselect all</a>)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier S</h3>
      </div>
      <draggable class="charlist" v-model="tierS" @start="drag = true" @end="drag = false" group="tiers"
        item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect"></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier A</h3>
      </div>
      <draggable class="charlist" v-model="tierA" @start="drag = true" @end="drag = false" group="tiers"
        item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect"></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier B</h3>
      </div>
      <draggable class="charlist" v-model="tierB" @start="drag = true" @end="drag = false" group="tiers"
        item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect"></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier C</h3>
      </div>
      <draggable class="charlist" v-model="tierC" @start="drag = true" @end="drag = false" group="tiers"
        item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect"></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier D</h3>
      </div>
      <draggable class="charlist" v-model="tierD" @start="drag = true" @end="drag = false" group="tiers"
        item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect" ></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Tier F</h3>
      </div>
      <draggable class="charlist" :list="tierF" @start="drag = true" @end="drag = false" group="tiers" item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect"></character-card>
        </template>
      </draggable>
    </div>
    <div class="v-card tierlist">
      <div class="title">
        <h3>Unranked</h3>
      </div>
      <draggable class="charlist" :list="noRank" @start="drag = true" @end="drag = false" group="tiers"
        item-key="index">
        <template #item="{ element, index }">
          <character-card :data-index="index" :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect"></character-card>
        </template>
      </draggable>
    </div>
    <div class="actions">
      <button @click="save">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Character from "../models/character";
import draggable from "vuedraggable";
import CharacterCard from "../components/CharacterCard.vue";
import { addToast } from "../stores/toast";
import { CharactersData, SaveAll } from "../stores/characters";

      const tierS = ref([]);
      const tierA = ref([]);
      const tierB = ref([]);
      const tierC = ref([]);
      const tierD = ref([]);
      const tierF = ref([]);
      const noRank = ref([]);
      const drag = ref(false);
      const selectedCharacters = ref([]);
      const actionSelection = ref(-1);

  onMounted(() => {
    loadData();
  });
// Methods
    function onCharacterSelect(uuid) {
        if (selectedCharacters.value.includes(uuid)) {
            selectedCharacters.value = selectedCharacters.value.filter(x => x !== uuid);
        } else {
            selectedCharacters.value.push(uuid);
        }
    }
    function isCharacterSelected(uuid) {
        return selectedCharacters.value.some(x => x === uuid);
    }
    function selectAll() {
        selectedCharacters.value = claimedCharacterList.value.map(x => x.uuid);
    }
    function deselectAll() {
        selectedCharacters.value = [];
    }
    function SetSelectedToTier(tier) {
        selectedCharacters.value.forEach(x => {
          SetTier(x, tier);
        })
        CharactersData.value.claimed = claimedCharacterList.value;
    }
    function SetTier(uuid, tier) {
      let characterIx = claimedCharacterList.value.findIndex(x => x.uuid === uuid);
      if (characterIx >= 0) {
        if(tier.length < 1) {
          claimedCharacterList.value[characterIx].ClearTier();
        } else {
          claimedCharacterList.value[characterIx].SetTier(tier);
        }
      }
    }
    function executeAction() {
        
        switch(parseInt(actionSelection.value)) {
            case 1: // Set to tier S
                SetSelectedToTier("S");
                break;
            case 2: // Set to tier A
                SetSelectedToTier("A");
                break;
            case 3: // Set to tier B
                SetSelectedToTier("B");
                break;
            case 4: // Set to tier C
                SetSelectedToTier("C");
                break;
            case 5: // Set to tier D
                SetSelectedToTier("D");
                break;
            case 6: // Set to tier F
                SetSelectedToTier("F");
                break;
            case 7: // Set to unranked
                SetSelectedToTier("");
                break;
            default:
                console.log("No action selected: ", parseInt(actionSelection.value));
                break;
        }
        actionSelection.value = -1;
        selectedCharacters.value = [];
        SaveAll();
        reset();
        loadData();
    }

    function reset() {
      noRank.value = [];
      tierS.value = [];
      tierA.value = [];
      tierB.value = [];
      tierC.value = [];
      tierD.value = [];
      tierF.value = [];

    }

    async function loadData() {

      CharactersData.value.claimed.forEach((character_data) => {
        const char = Character.FromJson(character_data);
        switch (char.tier) {
          default:
            noRank.value.push(char);
            break;
          case "S":
            tierS.value.push(char);
            break;
          case "A":
            tierA.value.push(char);
            break;
          case "B":
            tierB.value.push(char);
            break;
          case "C":
            tierC.value.push(char);
            break;
          case "D":
            tierD.value.push(char);
            break;
          case "F":
            tierF.value.push(char);
            break;
        }
      });
    }
    // Save character data to local storage
    function save(notify = true) {

      // Set character Tiers
      tierS.value.forEach((character) => {
        //console.log(character.name, 'setting character tier to S');
        character.SetTier("S");
      });
      tierA.value.forEach((character) => {
        character.SetTier("A");
      });
      tierB.value.forEach((character) => {
        character.SetTier("B");
      });
      tierC.value.forEach((character) => {
        character.SetTier("C");
      });
      tierD.value.forEach((character) => {
        character.SetTier("D");
      });
      tierF.value.forEach((character) => {
        character.SetTier("F");
      });
      noRank.value.forEach((character) => {
        character.ClearTier();
      });

      CharactersData.value.claimed = [...tierS.value, ...tierA.value, ...tierB.value, ...tierC.value, ...tierD.value, ...tierF.value, ...noRank.value];
    }

  const claimedCharacterList = computed(() => {
    return [...tierS.value, ...tierA.value, ...tierB.value, ...tierC.value, ...tierD.value, ...tierF.value, ...noRank.value];
  });
  
  const tierList = computed(() => {
      return JSON.stringify([
        [...noRank.value.map(x => x.uuid)],
        [...tierS.value.map(x => x.uuid)],
        [...tierA.value.map(x => x.uuid)],
        [...tierB.value.map(x => x.uuid)],
        [...tierC.value.map(x => x.uuid)],
        [...tierD.value.map(x => x.uuid)],
        [...tierF.value.map(x => x.uuid)],
      ]);
    });

  watch(tierList, () => {
      // console.log('changes made.');
      save();
    }
  );
</script>

<style lang="scss">
.tierlist {
  .charlist {
    min-height: 50px;
  }
}
</style>
