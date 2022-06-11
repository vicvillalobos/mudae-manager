<script setup>
// Libraries
import { computed, ref, onMounted } from "vue";
import { addToast } from "../stores/toast";
import draggable from "vuedraggable";
// Models
import Series from "../models/series";
import Character from "../models/character";
// Components
import CharacterCard from "../components/CharacterCard.vue";
import SeriesGroup from "../components/SeriesGroup.vue";
import CharacterCardModal from "../components/CharacterCardModal.vue";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import AddCharacterModal from "../components/AddCharacterModal.vue";
import MmasDialogue from "../components/MmasDialogue.vue";
import ExportDialogue from "../components/ExportDialogue.vue";

// Text from $mmas command
const mmasInput = ref("");

// Number of characters loaded
let charactersLoaded = ref(0);
// Number of total characters from $mmas
let charactersTotal = ref(0);
// Character data list
let characterList = ref([]);
// Are we loading data?
let loadingCharacters = ref(false);
// List group by
let displayMode = ref("ungrouped");
// List sorting mode
let sortMode = ref("series");
// Is the user dragging a card?
let drag = ref(false);
// Are we showing a character modal?
const showCharacterModal = ref(false);
// Character data for the modal
const characterModalData = ref(null);
// CSS Variable data for the character modal
const characterModalCSS = ref("");

const characterModal = ref(null);

const deleteConfirmationModalActive = ref(false);

const deleteDivorceConfirmationActive = ref(false);

const deleteCharacterIntent = ref(null);

const toasterRef = ref(null);

const addCharacterModalRef = ref(null);

const mmasDialogueRef = ref(null);

const exportDialogueRef = ref(null);

const divorceList = ref([]);

const showClearConfirmation = ref(false);

const searchString = ref("");

function addCharacterToDivorceList(character) {
  if (!characterInDivorceList(character)) {
    divorceList.value.push(character);
  } else {
    divorceList.value = divorceList.value.filter(
      (c) => c.name !== character.name
    );
  }
}

function characterInDivorceList(character) {
  return divorceList.value.includes(character);
}

function intentDeleteCharacter(character) {
  deleteCharacterIntent.value = character;
  deleteConfirmationModalActive.value = true;
}

function showDivorceDeleteConfirmationModal() {
  if (divorceList.value.length > 0) {
    deleteDivorceConfirmationActive.value = true;
  } else {
    addToast("No characters selected for divorce", "warning");
  }
}

function confirmDeleteDivorced() {
  if (divorceList.value.length > 0) {
    characterList.value = characterList.value.filter((character) => {
      // characters that return true here are kept
      return !divorceList.value.includes(character);
    });
  }
  divorceList.value = [];
  deleteDivorceConfirmationActive.value = false;
  saveDataToStorage();
  addToast("The selected characters were deleted", "trash");
}

function confirmDelete() {
  console.log("confirmDelete");
  deleteConfirmationModalActive.value = false;
  if (deleteCharacterIntent.value) {
    characterList.value = characterList.value.filter(
      (character) => character.name !== deleteCharacterIntent.value.name
    );
    deleteCharacterIntent.value = null;
    saveDataToStorage();
    addToast("Character removed", "trash");
  }
}

function cancelDelete() {
  console.log("cancelDelete");
  deleteConfirmationModalActive.value = false;
  deleteCharacterIntent.value = null;
}

// Changes the modal character data & hides/shows the modal
function toggleCharacterModal(v, character) {
  //console.log("[App.vue] toggleCharacterModal(", v, ",", character, ")");
  if (v) {
    characterModal.value.showModal(character);
  } else {
    characterModal.value.hideModal();
  }
}

// Save character data
function saveCharacter(character_data) {
  //console.log("save character grouped intent", character_data);
  const character = character_data.character;
  const data = character_data.data;
  character.FromJson(data);
  saveDataToStorage();
}

// Clear all character data.
// This will also clear the $mmas input.
function clearList() {
  mmasInput.value = "";
  characterList.value = [];
  saveDataToStorage(false);
  addToast("Data cleared", "eraser");
  showClearConfirmation.value = false;
}

async function executeMmas(mmas) {
  if (characterList.value.length > 0) {
    await replaceDataFromMMS(mmas);
  } else {
    await loadDataFromMMS(mmas);
  }
  saveDataToStorage();
}

// Load character data from $mmas input
// First fetch series data from anilist, including characters details.
// Then fetch individual character details for those not found in the series data.
async function loadDataFromMMS(mmasInput) {
  loadingCharacters.value = true;
  //console.log("loading characters");
  try {
    const series = Series.GetSeriesFromMMAS(mmasInput);

    await fetchAndPush(series);

    loadingCharacters.value = false;
  } catch (e) {
    console.trace(e);
  }
}

async function fetchAndPush(series) {
  charactersLoaded.value = 0;
  charactersTotal.value = 0;
  // count characters
  series.forEach((series) => {
    charactersTotal.value += series.characters.length;
  });
  for (let i = 0; i < series.length; i++) {
    if (series[i].characters.length <= 0) {
      continue;
    }
    console.log(`fetching data for series ${i + 1}/${series.length}...`);
    const res = await series[i].FetchData();

    characterList.value = [...characterList.value, ...series[i].characters];
    charactersLoaded.value += series[i].characters.length;
  }
}

async function replaceDataFromMMS(mmasInput) {
  loadingCharacters.value = true;

  try {
    const cloneCharacters = [...characterList.value];
    const seriesList = Series.GetSeriesFromMMAS(mmasInput);

    let charactersInput = [];

    seriesList.forEach((series) => {
      charactersInput = [...charactersInput, ...series.characters];
    });

    // Remove characters not in the input list from the current list.
    characterList.value = characterList.value.filter(
      (character) =>
        charactersInput.find((c) => c.name === character.name) !== undefined
    );

    // Remove characters in the list from the input list.
    charactersInput = charactersInput.filter(
      (character) =>
        characterList.value.find((c) => c.name === character.name) === undefined
    );

    // Remove characters not in the new input from the old input.
    // Also remove series with no characters.
    seriesList.forEach((series) => {
      series.characters = series.characters.filter(
        (character) =>
          charactersInput.find((c) => c.name === character.name) !== undefined
      );
    });

    // New characters:
    // Apply remaining characters in input to the list.
    await fetchAndPush(seriesList);
  } catch (e) {
    console.trace(e);
  }
  loadingCharacters.value = false;
}

// Save character data to local storage
function saveDataToStorage(notify = true) {
  localStorage.setItem(
    "v-mudae-ranking-characters",
    btoa(
      encodeURIComponent(
        JSON.stringify(
          characterList.value.map((x) => {
            return x.toJson();
          })
        )
      )
    )
  );
  if (notify) addToast("Changes saved", "save");
}

function showAddModal() {
  console.log(addCharacterModalRef.value);
  addCharacterModalRef.value.showModal();
}

function addCharacter(character) {
  characterList.value.push(character);
}

// Load character data from local storage
async function loadDataFromStorage() {
  const data = localStorage.getItem("v-mudae-ranking-characters");
  if (data) {
    const decoded = decodeURIComponent(atob(data));
    const char_list = JSON.parse(decoded);
    const l = [];
    char_list.forEach((character_data) => {
      l.push(Character.FromJson(character_data));
    });
    characterList.value = l;
  } else {
    console.log("no data found in storage");
  }
}

// On Mounted, load data from storage
onMounted(() => {
  loadDataFromStorage();
});

// Generate character list grouped by series
const charListGroupedBySeries = computed(() => {
  const series = [];
  characterList.value.forEach((character) => {
    const series_index = series.findIndex((x) => x.name === character.series);
    if (series_index === -1) {
      const s = new Series(character.series);
      s.characters.push(character);
      series.push(s);
    } else {
      series[series_index].characters.push(character);
    }
  });
  return [...series]
    .map((s) => {
      s.characters = [...s.characters].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      return s;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
});

function showMmasDialogue() {
  mmasDialogueRef.value.showModal();
}

// Show commands to sort characters in mudae.
function showSortingExport() {
  exportDialogueRef.value.showModal(
    charListSortCommands.value,
    "Paste these commands on discord.",
    true
  );
}

// Show commands to sort characters in mudae.
function showDivorceExport() {
  if (divorceList.value.length > 0) {
    exportDialogueRef.value.showModal(
      divorceListCommands.value,
      "Paste this command on discord to divorce the selected characters.",
      true
    );
  } else {
    addToast("No characters selected for divorce", "exclamation-triangle");
  }
}

const divorceListCommands = computed(() => {
  let str = `$divorce `;

  str += divorceList.value.map((x) => `${x.name}`).join("$");

  return str;
});

const charListSortCommands = computed(() => {
  if (characterList.value.length <= 0) return "";
  let str = `<p>$firstmarry ${characterList.value[0].name}</p>`;

  // split characterList into groups of 19

  const groups = [];

  for (let i = 0; i < characterList.value.length; i++) {
    // 0 - 19
    // 19 - 38
    // 38 - 57
    // 57 - 76
    // ...
    groups.push(characterList.value.slice(i * 19, (i + 1) * 19 + 1));
  }

  let last_character = characterList.value[0];
  groups.forEach((group, i) => {
    str += `<p>`;
    group.forEach((character, j) => {
      if (j == 0) {
        str += `$sortmarry pos ${character.name}`;
      } else {
        str += `$${character.name}`;
      }
      //last_character = character;
    });
    str += `</p>`;
  });

  return str;
});

const filteredList = computed(() => {
  const list = characterList.value.filter((x) => {
    return (
      x.name.toLowerCase().includes(searchString.value.toLowerCase()) ||
      x.series.toLowerCase().includes(searchString.value.toLowerCase()) ||
      x.alternative.some((name) => {
        name.toLowerCase().includes(searchString.value.toLowerCase());
      })
    );
  });
  const results_number = list.length > 1 ? ` (${list.length})` : "";
  return new Series(`Search Results${results_number}`, list);
});
</script>

<template>
  <div class="characters-page">
    <div class="v-card loadingBar" v-if="loadingCharacters">
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          :style="`width: ${(charactersLoaded / charactersTotal) * 100}%;`"
          :aria-valuenow="(charactersLoaded / charactersTotal) * 100"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {{ charactersLoaded }}/{{ charactersTotal }} ({{
            parseInt((charactersLoaded / charactersTotal) * 100)
          }}%)
        </div>
      </div>
    </div>
    <div class="v-card" v-if="!loadingCharacters && characterList.length <= 0">
      <p>
        To start, enter the $mmas command on discord and copy the list the Mudae
        bot will send you. Then press the 'input from $mmas' button and paste it
        on the text box that will appear.
      </p>
    </div>
    <div
      class="data-step"
      v-if="characterList.length > 0 && !loadingCharacters"
    >
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label for="search">Search</label>
            <input
              type="text"
              placeholder="Search by name or series"
              class="form-control"
              id="search"
              v-model="searchString"
            />
          </div>
        </div>
        <div class="col-6" v-if="searchString.trim().length <= 0">
          <div class="form-group">
            <label for="display-mode">Group by</label>
            <select v-model="displayMode">
              <option value="ungrouped">No Groups (Sortable)</option>
              <option value="group_series">Series (Not sortable)</option>
            </select>
          </div>
        </div>
        <div class="col-6" v-else>
          <div class="form-group">
            <label for="display-mode">Group by</label>
            <select disabled>
              <option selected>Search results (Not sortable)</option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="v-card"
        v-if="searchString.trim().length <= 0 && displayMode == 'ungrouped'"
      >
        <p>
          You can drag and drop character cards to sort them. Make sure to press
          the Save button when you're done.
        </p>
        <draggable
          class="charlist"
          v-model="characterList"
          @start="drag = true"
          @end="drag = false"
          item-key="index"
        >
          <template #item="{ element, index }">
            <character-card
              :data-index="index"
              :character="element"
              :divorcing="characterInDivorceList(element)"
              @toggle-divorce="addCharacterToDivorceList"
              @delete-character="intentDeleteCharacter"
              @show-modal="toggleCharacterModal(true, element)"
            ></character-card>
          </template>
        </draggable>
      </div>
      <div
        class="charlist v-card grouped"
        v-if="searchString.trim().length <= 0 && displayMode == 'group_series'"
      >
        <series-group
          v-for="series in charListGroupedBySeries"
          :key="series.name"
          :series="series"
          :divorce-list="divorceList"
          @toggle-divorce="addCharacterToDivorceList"
          @delete-character="intentDeleteCharacter"
          @show-modal="toggleCharacterModal(true, $event)"
        ></series-group>
      </div>
      <div
        class="charlist v-card grouped"
        v-if="searchString.trim().length > 0"
      >
        <series-group
          :series="filteredList"
          :divorce-list="divorceList"
          @toggle-divorce="addCharacterToDivorceList"
          @delete-character="intentDeleteCharacter"
          @show-modal="toggleCharacterModal(true, $event)"
        ></series-group>
      </div>
    </div>
    <div class="actions" v-if="!loadingCharacters">
      <button @click="showMmasDialogue">Input from $mmas</button>
      <button @click="showAddModal">Add</button>
      <button @click="saveDataToStorage">Save</button>
      <button @click="showClearConfirmation = true">Clear</button>
      <button @click="showSortingExport">Export $sortmarry</button>
      <button @click="showDivorceExport">Export $divorce</button>
      <button @click="showDivorceDeleteConfirmationModal">
        Delete selected
      </button>
    </div>
    <character-card-modal
      ref="characterModal"
      @delete-character="intentDeleteCharacter"
      @save-character="saveCharacter"
      @hide-modal="toggleCharacterModal(false, null)"
    />
    <confirmation-modal
      v-if="deleteCharacterIntent"
      :text="`Are you sure you want to delete ${deleteCharacterIntent.name}?`"
      :active="deleteConfirmationModalActive"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <confirmation-modal
      :text="`Are you sure you want to delete the following characters: ${divorceList
        .map((x) => x.name)
        .join(', ')}?`"
      :active="deleteDivorceConfirmationActive"
      @confirm="confirmDeleteDivorced"
      @cancel="deleteDivorceConfirmationActive = false"
    /><confirmation-modal
      :text="`Are you sure you want to delete <strong>ALL</strong> characters?`"
      :active="showClearConfirmation"
      @confirm="clearList"
      @cancel="showClearConfirmation = false"
    />
    <add-character-modal
      ref="addCharacterModalRef"
      confirmText="Add Character"
      @add-character="addCharacter"
    />
    <export-dialogue ref="exportDialogueRef" />
  </div>
</template>

<style lang="scss"></style>
