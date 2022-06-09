import { ref } from "vue";

const state = ref({
    environment: "local",
});


const mutations = {
    m_update() {
        state.value.environment = process.env.NODE_ENV;
    }
}

function UpdateEnvironment() {
    mutations.m_update();
}


export { state, UpdateEnvironment };