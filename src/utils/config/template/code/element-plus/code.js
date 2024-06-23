const { createApp, ref } = Vue

const App = createApp({
  setup() {
    const message = ref("This is a template of Element Plus!")
    return {
      message,
    }
  },
})
App.use(ElementPlus)
App.mount("#app")