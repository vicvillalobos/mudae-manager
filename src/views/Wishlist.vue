<template>
  <div class="v-card" v-if="wishedCharacterList.length <= 0">
    <p>
      To get started, use the 'New wish' button to add a character to your wishlist. Try to use exactly the same name
      and series as it appears on Mudae. Otherwise, the bot may not recognize the character when using exported
      commands.
      Once added, you can then edit the character's details and the app will keep track of the original name.
    </p>
    <p>
      If the character data is not found (probably will not display an image), try searching the character on
      Anilist.co, edit the character's name and series name accordingly and then press 'Fetch' in the character
      card.<br />
      You can also add an image URL manually in the character card, in case the character is not found on Anilist.
    </p>
    <p>
      This wishlist is meant to be larger than the one you have on Mudae, so you can keep record of the characters you
      want even if they don't fit in your server wishlist.<br />
      You can also mark each wished character as 'claimed' or 'stolen' to remove them from the exports and keep record
      of your wish spawns.
    </p>
    <button class="btn btn-primary" @click.prevent="showNewWishModal">New Wish</button>
  </div>
  <section v-else>
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
            <option :value="1">Remove characters</option>
          </select>
        </div>
        <div class="col-md-1">
          <button class="btn btn-outline-primary" @click.prevent="executeAction">Go</button>
        </div>
        <div class="col-md-4">
          <div class="text">
            {{ selectedCharacters.length }} of {{ wishedCharacterList.length }} characters selected.
            <span v-if="wishedCharacterList.length > selectedCharacters.length">(<a href="#" @click.prevent="selectAll">Select
                all</a>)</span>
            <span v-else>(<a href="#" @click.prevent="deselectAll">Deselect all</a>)</span>
          </div>
        </div>
        <div class="col-md-1">
          <button class="btn btn-primary" @click.prevent="showNewWishModal">New Wish</button>
        </div>
      </div>
    </div>
    <div class="v-card">
      <draggable class="charlist" v-model="wishedCharacterList" @start="drag = true" @end="drag = false"
        item-key="index">
        <template #item="{ element, index }">
          <CharacterCard :character="element" :selected="isCharacterSelected(element.uuid)"
            @character-selected="onCharacterSelect" />
        </template>
      </draggable>
    </div>
  </section>
  <new-wish-modal ref="newWishModal" @add-wish="addCharacterWish" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";

import { CharactersData, SaveAll } from "../stores/characters";

import NewWishModal from "../components/NewWishModal.vue";
import CharacterCard from "../components/CharacterCard.vue";

// Data refs
const wishedCharacterList = ref([]);
const selectedCharacters = ref([]);
const actionSelection = ref(-1);
const drag = ref(false);

// Component refs
const newWishModal = ref(null);

// Lifetime Hook: mounted
onMounted(() => {
  wishedCharacterList.value = CharactersData.value.wished;
});

// Methods
function showNewWishModal() {
  newWishModal.value.showModal();
}

function addCharacterWish(character) {
  wishedCharacterList.value.push(character);

  CharactersData.value.wished = wishedCharacterList.value;

  SaveAll();
}

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
  selectedCharacters.value = wishedCharacterList.value.map(x => x.uuid);
}

function deselectAll() {
  selectedCharacters.value = [];
}

    function executeAction() {
        switch(actionSelection.value) {
            case 1:
                // Filter out selected characters
                CharactersData.value.wished = CharactersData.value.wished.filter(x => !selectedCharacters.value.includes(x.uuid));
                // Refresh
                wishedCharacterList.value = CharactersData.value.wished;
                // Reset selection
                selectedCharacters.value = [];
                // Reset action selection
                actionSelection.value = -1;
                break;
            default:
                console.log("No action selected");
                break;
        }
    }
</script>

<style>
</style>
