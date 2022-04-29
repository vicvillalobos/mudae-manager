import { ref } from "vue";

const state = ref({
  toasts: [],
});

const mutations = {
  m_addToast(text, icon, time) {
    state.value.toasts.push({
      time,
      text,
      icon,
    });
  },
  m_removeToast(time) {
    state.value.toasts = state.value.toasts.filter((toast) => {
      return toast.time !== time;
    });
  },
};

// Actions

function addToast(text, icon, timeout = 5000) {
  const time = new Date().getTime();
  mutations.m_addToast(text, icon, time);
  setTimeout(() => {
    mutations.m_removeToast(time);
  }, timeout);
}

export { state, addToast };
