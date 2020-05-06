<template>
  <div id="shortcut">
    <ul class="shortcut-list flex flex-clo">
      <h3 class="title">{{shortcutInfo.common}}</h3>
      <li v-for="(item, index) in shortcutBoard" class="flex flex-ai" :key="index">
        <div v-for="(key, i) in item" :key="i">
          <span v-if="i!==0">＋</span>
          <kbd>{{key}}</kbd>
        </div>
        <span>{{shortcutInfo.shortcutList[index]}}</span>
      </li>
      <h3 class="title">{{shortcutInfo.markdown}}</h3>
      <li v-for="(item, index) in markdownBoard" class="flex flex-ai" :key="index">
        <div v-for="(key, i) in item" :key="i">
          <span v-if="i!==0">＋</span>
          <kbd>{{key}}</kbd>
        </div>
        <span>{{shortcutInfo.markdownList[index]}}</span>
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
        ['Ctrl / Cmd', 'Alt'],
        ['Ctrl / Cmd', 'Q'],
        ['Ctrl / Cmd', '/'],
        ['Ctrl / Cmd', 'Shift', 'D'],
        ['Ctrl / Cmd', 'D'],
        ['Shift', 'Ctrl / Cmd', 'Up'],
        ['Shift', 'Ctrl / Cmd', 'Down'],
        ['Ctrl / Cmd', '1'],
        ['Ctrl / Cmd', '2'],
        ['Ctrl / Cmd', '3'],
        ['Ctrl / Cmd', '['],
        ['Ctrl / Cmd', ']'],
        ['Ctrl / Cmd', 'F'],
        ['Ctrl / Cmd', 'Shift', 'F'],
        ['Alt', 'G']
      ],
      markdownBoard: [
        ['Ctrl / Cmd', 'B'],
        ['Ctrl / Cmd', 'I'],
        ['Ctrl / Cmd', 'D'],
        ['Ctrl / Cmd', 'L'],
        ['Ctrl / Cmd', 'P'],
        ['Ctrl / Cmd', 'Shift', 'Q'],
        ['Ctrl / Cmd', 'K'],
        ['Ctrl / Cmd', 'U'],
        ['Ctrl / Cmd', 'O'],
        ['Ctrl / Cmd', 'H'],
        ['Ctrl / Cmd', 'Enter']
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
    .title {
      color: $afterFocus;
      font-size: 18px;
      margin: 5px 0;
    }
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
