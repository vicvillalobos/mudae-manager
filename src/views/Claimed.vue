<template>
    <div class="v-card" v-if="claimedCharacterList.length <= 0">
      <p>
        To start, enter the $mmas command on your desired mudae-enabled discord server and copy the list the Mudae
        bot will send you. Then press the 'Input $mmas' button and paste it on the text box that will appear.
      </p>
      <p>
        You can use the additional 'k' and 'y+' flags to include kakera value and key number.
      </p>
      <p>
          Compatible inputs: <code>$mmas</code>, <code>$mmask</code>, <code>$mmasy+</code>, <code>$mmasky+</code>
      </p>
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
                        <option :value="1">Generate divorce command</option>
                        <option :value="2">Remove characters</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-outline-primary" @click.prevent="executeAction">Go</button>
                </div>
                <div class="col-md-5">
                    <div class="text">
                        {{ selectedCharacters.length }} of {{ claimedCharacterList.length }} characters selected. 
                        <span v-if="claimedCharacterList.length > selectedCharacters.length">(<a href="#" @click.prevent="selectAll">Select all</a>)</span>
                        <span v-else>(<a href="#" @click.prevent="deselectAll">Deselect all</a>)</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="v-card">
            <draggable
            class="charlist"
            v-model="claimedCharacterList"
            @start="drag = true"
            @end="drag = false"
            item-key="index"
            >
            <template #item="{ element, index }">
                <CharacterCard :character="element" :selected="isCharacterSelected(element.uuid)" @character-selected="onCharacterSelect" />
                </template> 
                </draggable>   
        </div>
    </section>
</template>

<script setup>
    import { ref, computed, onMounted, watch, inject } from "vue";
    import draggable from "vuedraggable";

    import CharacterCard from "../components/CharacterCard.vue";
    import { CharactersData } from "../stores/characters";

    const emitter = inject('emitter');

    // Data refs
    const claimedCharacterList = ref([]);

    const selectedCharacters = ref([]);

    const actionSelection = ref(-1);
    
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

    function executeAction() {
        switch(actionSelection.value) {
            case 1:
                emitter.emit('show-divorce-output', selectedCharacters.value);
                break;
            case 2:
                // Filter out selected characters
                CharactersData.value.claimed = CharactersData.value.claimed.filter(x => !selectedCharacters.value.includes(x.uuid));
                // Refresh
                claimedCharacterList.value = CharactersData.value.claimed;
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

    // Lifetime Hook: mounted
    onMounted(() => {
        claimedCharacterList.value = CharactersData.value.claimed;
    });

    // Watchers
    watch(claimedCharacterList, async (newList, oldList) => {
        // Ignore if both lists are the same (order and length are the same)
        if (newList.length === oldList.length && newList.every((character, index) => character === oldList[index])) {
            return;
        }

        // Otherwise save the new list
        CharactersData.value.claimed = newList;
    });
</script>

<style lang="scss">
#app #ranking-app #claimed-characters-action-bar.v-card.action-card {
    padding:1em 0;
    position:relative;
    line-height: 1.8rem;

    .text-right {
        text-align: right;
    }
    select {
        padding:0.4em;
        width:100%;
        height:1.8rem;
    }
}
</style>