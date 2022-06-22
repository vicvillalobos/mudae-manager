import { ref } from "vue";
import AnilistLoader from "../models/anilist";
import Character from "../models/character";

import InputParser from "../models/input";
import Series from "../models/series";

import { addToast } from "./toast";

const LOCAL_STORAGE_CLAIMED_KEY = "mm_claimed_characters";
const LOCAL_STORAGE_WISHED_KEY = "mm_wished_characters";

// State
const CharactersData = ref({
    activeCharacter: null,
    claimed: [],
    wished: [],
});

// Mutations
const mutations = {
    m_selectCharacter(character) {
        CharactersData.value.activeCharacter = character;
    },

    m_deselectCharacter() {
        CharactersData.value.activeCharacter = null;
    },

    /// Adds characters to the claimed list
    m_addClaimedCharacters(charactersToBeAdded) {
        CharactersData.value.claimed = [...CharactersData.value.claimed, ...charactersToBeAdded];
    },

    /// Adds characters to the wished list
    m_addWishedCharacters(charactersToBeAdded) {
        CharactersData.value.wished = [...CharactersData.value.wished, ...charactersToBeAdded];
    },

    /// Removes characters from claimed list
    m_removeClaimedCharacters(charactersToBeRemoved) {
        CharactersData.value.claimed = CharactersData.value.claimed.filter(character => !charactersToBeRemoved.includes(character));
    },

    /// Removes characters from wished list
    m_removeWishedCharacters(charactersToBeRemoved) {
        CharactersData.value.wished = CharactersData.value.wished.filter(character => !charactersToBeRemoved.includes(character));
    },

    /// Updates character data from claimed list
    m_updateClaimedCharacters(charactersToBeUpdated, characterList) {
        let updated = 0;
        CharactersData.value.claimed.map(character => {
            // Only update if the character is in the list of characters to be updated
            if (charactersToBeUpdated.findIndex(c =>  c.name == character.name && c.series == character.series) != -1) {
                const updatedCharacter = characterList.find(updatedCharacter => updatedCharacter.name === character.name && updatedCharacter.series === character.series);

                if (updatedCharacter != null) {
                    character.FromJson(updatedCharacter);
                    character.status = "updated";
                }
            }
            return character;
        });
    },

    /// Updates a single character from claimed list
    m_updateClaimedCharacter(index, updatedCharacter) {

        if(index < 0) return;
        updatedCharacter.uuid = CharactersData.value.claimed[index].uuid;
        updatedCharacter.mudaeName = CharactersData.value.claimed[index].mudaeName;
        // The following line might prevent the character from having their mudae image updated.
        updatedCharacter.mudaeImage = CharactersData.value.claimed[index].mudaeImage;

        console.log("Updating character: ", CharactersData.value.claimed[index].toJson());
        console.log("With data: ", updatedCharacter.toJson());
        CharactersData.value.claimed[index] = updatedCharacter;
    },

    /// Adds new characters from the input to the claimed list, 
    /// and removes characters not present in the input list from the claimed list.
    /// Characters in the claimed list with the same name as a character in the input list will be updated (ka and keys).
    m_importCharacters(characterList) {
        const claimed = CharactersData.value.claimed;

        // Add new characters
        const newCharacters = characterList.filter(character => claimed.findIndex(x => {
            return character.name === x.mudaeName && character.series === x.series;
        }) < 0);
        newCharacters.map(char => {
            char.status = "parsed-new";
            return char;
        })
        mutations.m_addClaimedCharacters(newCharacters);

        // Remove characters that are not present in the input list
        //const charactersToBeRemoved = claimed.filter(character => !characterList.includes(character));

        const charactersToBeRemoved = claimed.filter(character => characterList.findIndex(x => {
            return character.mudaeName === x.name && character.series === x.series;
        }) < 0);
        mutations.m_removeClaimedCharacters(charactersToBeRemoved);

        // Update kakeraValue and keysAmount of characters that are present in both the input and claimed lists
        //const charactersToBeUpdated = claimed.filter(character => characterList.includes(character));

        const charactersToBeUpdated = claimed.filter(character => characterList.findIndex(x => {
            return character.mudaeName === x.mudaeName && character.series === x.series;
        }) >= 0);

        charactersToBeUpdated.map(char => {
            char.status = "parsed-update";
            return char;
        })
        // Update DOES NOT INCLUDE anilist data, just mudae data.
        mutations.m_updateClaimedCharacters(charactersToBeUpdated, claimed);
    },

    /// Clears both lists and saves (confirmation dialog required)
    m_clearAll() {
        CharactersData.value.claimed = [];
        CharactersData.value.wished = [];
        mutations.m_saveToStorage();
    },
    m_saveToStorage() {
        mutations.m_saveClaimedCharacters();
        mutations.m_saveWishedCharacters();
    },
    m_loadFromStorage() {
        mutations.m_loadClaimedCharacters();
        mutations.m_loadWishedCharacters();
    },
    /// Saves data to local Storage
    /// TODO: Optimize storage to avoid max size limit
    m_saveClaimedCharacters() {
        const claimedCharacters = CharactersData.value.claimed.map(x => x.toJson());

        // Convert to JSON
        const json = JSON.stringify(claimedCharacters);

        // Encode to base64
        const encoded = btoa(encodeURIComponent(json));

        // Save to local storage
        // TODO: Associate key with username
        localStorage.setItem(LOCAL_STORAGE_CLAIMED_KEY, encoded);
    },
    m_saveWishedCharacters() {
        const wishedCharacters = CharactersData.value.wished.map(x => x.toJson());

        // Convert to JSON
        const json = JSON.stringify(wishedCharacters);

        // Encode to base64
        const encoded = btoa(encodeURIComponent(json));

        // Save to local storage
        localStorage.setItem(LOCAL_STORAGE_WISHED_KEY, encoded);
    },
    m_loadClaimedCharacters() {
        // Get data from local storage
        const encoded = localStorage.getItem(LOCAL_STORAGE_CLAIMED_KEY);

        if (!encoded) return;

        // Decode from base64
        const json = decodeURIComponent(atob(encoded));

        // Convert to JS object
        const claimedCharacters = JSON.parse(json);

        // Update state
        CharactersData.value.claimed = claimedCharacters.map(character => Character.FromJson(character));
    },
    m_loadWishedCharacters() {
        // Get data from local storage
        const encoded = localStorage.getItem(LOCAL_STORAGE_WISHED_KEY);

        if (!encoded) return;

        // Decode from base64
        const json = decodeURIComponent(atob(encoded));

        try {
        // Convert to JS object
        const wishedCharacters = JSON.parse(json);

        // Update state
        CharactersData.value.wished = wishedCharacters.map(character => Character.FromJson(character));
        } catch (e) {
            console.log("Error parsing data: ", e);
            console.log(json);
        }
    }
}

// Actions
function ImportCharacters(mmas) {
    const characters = InputParser.Parse(mmas);
    mutations.m_importCharacters(characters);
}

async function FetchCharactersData() {

    // Get Series names
    const seriesNames = CharactersData.value.claimed.map(character => character.series);
    // Remove duplicates
    const uniqueSeriesNames = [...new Set(seriesNames)];

    for (let i = 0; i < uniqueSeriesNames.length; i++) {
        const seriesName = uniqueSeriesNames[i];
        await AnilistLoader.SearchCharactersBySeriesName(CharactersData.value.claimed.filter(x => x.status == 'parsed-new'), new Series(seriesName));   
    }
}

function SaveClaimedCharacters() {
    mutations.m_saveClaimedCharacters();

    addToast("Saved claimed characters", "check", 2000);
}

function SaveWishedCharacters() {
    mutations.m_saveWishedCharacters();

    addToast("Saved wishlist", "check", 2000);
}

function SaveCharacterData(uuid, new_data) {
    const index = CharactersData.value.claimed.findIndex(c => c.uuid == uuid);
    const updated_character = Character.FromJson(new_data);
    mutations.m_updateClaimedCharacter(index, updated_character);
    SaveAll();
}

function SaveAll() {
    mutations.m_saveToStorage();

    addToast("Saved all characters", "check", 2000);
}

function LoadAll() {
    mutations.m_loadFromStorage();
}

function ClearAll() {
    mutations.m_clearAll();

    addToast("Cleared all characters", "check", 2000);
}

function SelectActiveCharacter(character_uuid) {
    CharactersData.value.activeCharacter = character_uuid;
}

export { CharactersData, ImportCharacters, FetchCharactersData, SaveClaimedCharacters, SaveAll, LoadAll, ClearAll, SaveCharacterData, SelectActiveCharacter };