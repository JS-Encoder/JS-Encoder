<template>
  <div id="shortcut">
    <ul class="shortcut-list flex flex-clo">
      <li v-for="(item, index) in shortcutBoard" class="flex flex-ai" :key="index">
        <div v-for="(key, i) in item" :key="i">
          <span v-if="i!==0">＋</span>
          <kbd>{{key}}</kbd>
        </div>
        <span>{{shortcutInfo.shortcutList[index]}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shortcutBoard: [
        ['Tab'],
        ['Shift', 'Alt', 'F'],
        ['Ctrl', 'Alt'],
        ['Ctrl', 'Q'],
        ['Ctrl', '/'],
        ['Ctrl', 'Shift', 'D'],
        ['Ctrl', 'D'],
        ['Shift', 'Ctrl', 'Up'],
        ['Shift', 'Ctrl', 'Down'],
        ['Ctrl', '1'],
        ['Ctrl', '2'],
        ['Ctrl', '3'],
        ['Ctrl', '['],
        ['Ctrl', ']']
      ]
    }
  },
  computed: {
    shortcutInfo() {
      return window.Global.language.dialogInfo.shortcut
    }
  },
  methods: {},
  components: {}
}
</script>

<style lang="scss" scoped>
#shortcut {
  .shortcut-list {
    font-size: 14px;
    list-style: none;
    li {
      margin: 5px 0;
      position: relative;
      & > span {
        position: absolute;
        right: 0;
      }
    }
    span {
      color: $afterFocus;
    }
  }
}
</style>
