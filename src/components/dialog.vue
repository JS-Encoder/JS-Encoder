<template>
  <div id="dialog" class="flex flex-clo noselect">
    <header class="dialog-header flex flex-ai">
      <span class="dialog-title">{{ dialogInfo.title }}</span>
      <i class="icon iconfont icon-close" @click.stop="closeDialog"></i>
    </header>
    <Welcome v-if="dialogName==='welcome'"></Welcome>
    <Preprocessor v-if="dialogName==='preprocessor'"></Preprocessor>
    <Library v-else-if="dialogName==='library'"></Library>
    <MoreOpt v-else-if="dialogName==='more'"></MoreOpt>
    <Upload v-else-if="dialogName==='upload'"></Upload>
    <Download v-else-if="dialogName==='download'"></Download>
    <SwitchColor v-else-if="dialogName==='switch'"></SwitchColor>
    <SelectColor v-else-if="dialogName==='select'"></SelectColor>
    <NewFeature v-else-if="dialogName==='newFeature'"></NewFeature>
    <Shortcut v-else-if="dialogName==='shortcut'"></Shortcut>
    <NewProject v-else-if="dialogName==='newProject'"></NewProject>
    <PersonalSetting v-else-if="dialogName==='personalSetting'"></PersonalSetting>
    <Logout v-else-if="dialogName==='logOut'"></Logout>
    <div class="feedback flex" v-else-if="dialogName==='feedback'">
      <span>{{feedbackInfo.feedbackDescribe}}</span>
      🧐<a target="black" href="https://github.com/Longgererer/JS-Encoder/issues">{{feedbackInfo.toFeedback}}</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as judge from '@/utils/judgeMode'
import Upload from './dialogList/upload'
import Download from './dialogList/download'
import SwitchColor from './dialogList/switchColor'
import SelectColor from './dialogList/selectColor'
import NewFeature from './dialogList/newFeature'
import Shortcut from './dialogList/shortcut'
import Preprocessor from './dialogList/preprocessor'
import Library from './dialogList/library'
import MoreOpt from './dialogList/moreOpt'
import NewProject from './dialogList/newProject'
import PersonalSetting from './dialogList/personalSetting'
import Welcome from './dialogList/welcome'
import Logout from './dialogList/logout'
export default {
  props: {
    dialogName: String
  },
  components: {
    Upload,
    Download,
    SwitchColor,
    SelectColor,
    NewFeature,
    Shortcut,
    Preprocessor,
    Library,
    MoreOpt,
    NewProject,
    PersonalSetting,
    Welcome,
    Logout
  },
  computed: {
    dialogInfo() {
      const dialogInfo = window.Global.language.dialogInfo
      const dialogName = this.dialogName
      return dialogInfo[dialogName]
    },
    feedbackInfo() {
      return window.Global.language.dialogInfo.feedback
    }
  },
  methods: {
    closeDialog() {
      const commit = this.$store.commit
      commit('updateShowBg', false)
      commit('updateCurrentDialog', '')
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/dialog.scss" scoped></style>
<style lang="scss" scoped>
#dialog {
  position: relative;
  .dialog-header {
    @include setWAndH(480px, 30px);
    border-bottom: 2px solid $describe;
    background-color: $primaryHued;
    position: fixed;
    z-index: 1500;
    .dialog-title {
      color: $afterFocus;
      font-weight: 600;
      font-size: 18px;
    }
    & ~ div {
      margin-top: 30px;
    }
    & > i {
      @include setTransition(all, 0.3s, ease);
      color: $beforeFocus;
      position: absolute;
      right: 0;
      &:hover {
        color: $afterFocus;
      }
    }
  }
  .feedback {
    padding: 10px 0;
    color: $afterFocus;
    a {
      color: #af83ff;
    }
  }
}
</style>