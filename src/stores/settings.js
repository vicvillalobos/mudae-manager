import { ref } from "vue";
import { state } from "./environment";

const AppSettings = ref({
    // NOTE: modifying this values will change the defaults

    // "always": (default) Always use the mudae pictures. This mode is forced if downloadData is false.
    // "fill": Use the mudae picture if the character wasn't found on anilist. This mode is disabled when downloadData is false.
    // "never": Never use the mudae picture, even if the character wasn't found on anilist. This mode is disabled when downloadData is false.
    //
    useMudaeImages: 'always',

    // "always": Animate all gifs always.
    // "mouseover": Animate gifs only when the mouse is over them.
    // "never": Never animate gifs.
    animateGifs: 'always',

    // If true, the application will fetch character data from anilist.
    // If false, the application will only use the data from the $mmas command.
    // (Works best when using the i- flag, otherwise user will only see placeholder images).
    // The user can download data from anilist anyway by using the fetch button on the character card.
    // That should NOT replace the image (since useMudaeImages is still forced to "always").
    // Setting this to false can help agilize usage if character data isn't important to the user.
    downloadData: true,


});


const mutations = {
    m_updateSettings(new_values) {
        AppSettings.value = { ...AppSettings.value, ...new_values };
    }
}

function UpdateSettings(new_values) {
    mutations.m_updateSettings(new_values);
}


export { AppSettings, UpdateSettings };