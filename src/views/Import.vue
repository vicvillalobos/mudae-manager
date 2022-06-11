<template>
  <div class="page-import">
    <div class="v-card">
        Loading ...
    </div>  
    <div class="v-card">
        <button @click="startFetch">Start Fetching</button>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Series</th>
                    <th scope="col">Keys</th>
                    <th scope="col">Kakera Value</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(character, index) in claimedCharacters">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ character.name }}</td>
                    <td>{{ character.series }}</td>
                    <td>{{ character.keysAmount }}</td>
                    <td>{{ character.kakeraValue }}</td>
                    <td>{{ character.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import { CharactersData, FetchCharactersData, SaveClaimedCharacters } from "../stores/characters";
export default {
    methods: {
        async startFetch() {
            await FetchCharactersData();
            await SaveClaimedCharacters();
        }
    },
    computed: {
        claimedCharacters() {
            return CharactersData.value.claimed;
        }
    }
};
</script>

<style></style>
