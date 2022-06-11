<template>
    <div class="page-settings">
        <div class="v-card">
            <div class="v-card__title">
                <h3>Application Settings</h3>
            </div>
            <div class="form">
                <div class="form-group">
                    <label>Use Mudae Images</label>
                    <select v-model="useMudaeImages">
                        <option value="always">Always</option>
                        <option value="fill">Last option</option>
                        <option value="never">Never</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Animate GIFs</label>
                    <select v-model="animateGifs">
                        <option value="always">Always</option>
                        <option value="mouseover">On Mouse Over</option>
                        <option value="never">Never</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Download data from anilist.co</label>
                    <select v-model="downloadData">
                        <option :value="true">Yes</option>
                        <option :value="false">No</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    import { AppSettings } from '../stores/settings';

    const useMudaeImages = ref(AppSettings.value.useMudaeImages);
    const animateGifs = ref(AppSettings.value.animateGifs);
    const downloadData = ref(AppSettings.value.downloadData);
</script>