const { createApp, ref } = Vue

createApp({
  setup() {
    const message = ref("This is a template of Vue!")
    return {
      message,
    }
  },
}).mount("#app")