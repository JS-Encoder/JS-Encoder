<template>
  <div id="project" class="flex flex-clo noselect">
    <div class="poster-box" :title="projectInfo.projectName">
      <div class="poster-screen flex flex-ai flex-jcc">
        <i @click="editProject" class="icon iconfont icon-genggai1" :title="langProjectMenuList[1]"></i>
      </div>
      <Loader class="poster-loader" v-show="showLoader"></Loader>
      <img class="poster" :src="poster" @load="loadImage" alt="" v-show="showImage">
    </div>
    <div class="project-opt-box flex flex-ai">
      <div class="project-title" v-if="showInput">
        <input @blur="updateName" class="name-input" type="text" v-focus="isFocus" v-model="projectInfo.projectName" />
        <div class="input-box"></div>
      </div>
      <span class="project-name" v-if="!showInput">{{projectInfo.projectName}}</span>
      <i @click="changeName" :title="langProjectDetail.rename" class="icon iconfont icon-genggai rename"
        style="font-size:16px" v-if="!showInput"></i>
      <el-dropdown class="dropdown-menu" placement="top-end" trigger="click">
        <i class="icon iconfont icon-gengduo more" style="font-size:25px"></i>
        <el-dropdown-menu class="menu" slot="dropdown" placement="bottom">
          <el-dropdown-item v-show="!projectInfo.status" @click.native="tagsDialogVisible=true"
            icon="icon iconfont icon-dingzi">
            {{langProjectMenuList[0]}}
          </el-dropdown-item>
          <el-dropdown-item @click.native="editProject" v-show="!projectInfo.status" icon="icon iconfont icon-genggai1">
            {{langProjectMenuList[1]}}
          </el-dropdown-item>
          <el-dropdown-item v-show="!projectInfo.status" @click.native="delDialogVisible=true"
            icon="icon iconfont icon-recyclebin">
            {{langProjectMenuList[2]}}
          </el-dropdown-item>
          <el-dropdown-item @click.native="recoverDialogVisible=true" v-show="projectInfo.status"
            icon="icon iconfont icon-huifu">
            {{langProjectMenuList[3]}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog class="delete-dialog" :title="langDelDialog.title" :visible.sync="delDialogVisible"
      :modal-append-to-body="false" :before-close="closeDelDialog" width="30%">
      <span>{{langDelDialog.content}}</span><br>
      <span class="describe">{{langDelDialog.describe}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible=false">{{langDelDialog.cancel}}</el-button>
        <el-button type="danger" @click="deleteProject">{{langDelDialog.confirm}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="tags-dialog" :title="langTagsDialog.title" :visible.sync="tagsDialogVisible"
      :modal-append-to-body="false" :before-close="closeTagsDialog" width="30%">
      <span class="describe">{{langNewProject.tagsDescribe}}</span>
      <el-input class="input" :disabled="disabled" @keyup.enter.native="addTags" v-model="currentTag" placeholder="">
      </el-input>
      <div class="tags-box flex flex-ai" v-show="tags.length">
        <el-tag v-for="(tag,index) in tags" :key="index" closable @close="deleteTag(index)">{{tag}}</el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tagsDialogVisible=false">{{langTagsDialog.cancel}}</el-button>
        <el-button type="primary" @click="updateTags">{{langTagsDialog.confirm}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="recover-dialog" :title="langRecoverDialog.title" :visible.sync="recoverDialogVisible"
      :modal-append-to-body="false" :before-close="closeRecoverDialog" width="30%">
      <span>{{langRecoverDialog.content}}</span><br>
      <span class="describe">{{langRecoverDialog.describe}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recoverDialogVisible=false">{{langRecoverDialog.cancel}}</el-button>
        <el-button type="primary" @click="recoverProject">{{langRecoverDialog.confirm}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import reqUserInfo from '@/utils/requestUserInfo'
import Loader from './load'
export default {
  props: {
    length: Number,
    index: Number,
    projectInfo: Object
  },
  data() {
    return {
      showInput: false,
      isFocus: false,
      delDialogVisible: false,
      tagsDialogVisible: false,
      recoverDialogVisible: false,
      append: true,
      currentTag: '',
      tags: [],
      disabled: false,
      tagsChanged: false,
      showLoader: true,
      showImage: false
    }
  },
  mounted() {
    this.tags = this.projectInfo.tags
  },
  watch: {
    isFocus(newVal) {
      // 用户修改完项目名称，更新到数据库
      if (newVal) return void 0
      const projectInfo = this.projectInfo
      reqUserInfo.updateProjectName(projectInfo._id, projectInfo.projectName)
    }
  },
  computed: {
    langLanguage() {
      return window.Global.language
    },
    langProfileInfo() {
      return this.langLanguage.profileInfo
    },
    langProjectDetail() {
      return this.langProfileInfo.projectDetail
    },
    langDelDialog() {
      return this.langProfileInfo.deleteTip
    },
    langTagsDialog() {
      return this.langProfileInfo.tagsTip
    },
    langRecoverDialog() {
      return this.langProfileInfo.recoverTip
    },
    langProjectMenuList() {
      return this.langProjectDetail.projectMenuList
    },
    language() {
      return this.$store.state.language
    },
    langNewProject() {
      return this.langLanguage.dialogInfo.newProject
    },
    poster() {
      return 'http://images.lliiooiill.cn/' + this.projectInfo.poster
    }
  },
  methods: {
    loadImage() {
      // 加载图片时显示加载动画
      this.showLoader = false
      this.showImage = true
    },
    changeName() {
      this.showInput = true
      this.isFocus = true
    },
    updateName() {
      this.isFocus = false
      this.showInput = false
    },
    closeDelDialog() {
      this.delDialogVisible = false
    },
    closeTagsDialog() {
      this.tagsDialogVisible = false
    },
    closeRecoverDialog() {
      this.recoverDialogVisible = false
    },
    addTags() {
      this.tagsChanged = true
      const tags = this.tags
      tags.push(this.currentTag)
      this.currentTag = ''
      if (tags.length >= 3) this.disabled = true
      else this.disabled = false
    },
    deleteTag(index) {
      this.tagsChanged = true
      const tags = this.tags
      tags.splice(index, 1)
      this.disabled = false
    },
    updateTags() {
      // 更新项目标签
      this.closeTagsDialog()
      if (!this.tagsChanged) return void 0
      const projectInfo = this.projectInfo
      reqUserInfo.updateTags(projectInfo._id, projectInfo.tags).then(res => {
        if (res) {
          this.projectInfo.tags = this.tags
        }
        const langTagsDialog = this.langTagsDialog
        const message = res ? langTagsDialog.success : langTagsDialog.fail
        const icon = res ? 'icon-success' : 'icon-error1'
        this.$notify({
          message,
          position: 'bottom-right',
          iconClass: 'icon iconfont ' + icon,
          duration: 1500
        })
        res && this.$emit('getAllTags') // 更新标签成功，触发父组件更新标签列表
      })
    },
    editProject() {
      /**
       * 将项目详情更新到state
       * 跳转到editor界面
       */
      const projectInfo = this.projectInfo
      const id = projectInfo._id
      const commit = this.$store.commit
      commit('updateProjectTags', projectInfo.tags)
      commit('updatePosterKey', projectInfo.poster)
      commit('updateProjectName', projectInfo.projectName)
      this.$router.push({ path: `/editor/${id}` })
    },
    deleteProject() {
      // 将项目移入回收站
      this.closeDelDialog()
      const userId = this.$store.state.userInfo._id
      const id = this.projectInfo._id
      reqUserInfo.removeProject(userId, id).then(res => {
        const langDelDialog = this.langDelDialog
        const message = res ? langDelDialog.success : langDelDialog.fail
        const icon = res ? 'icon-success' : 'icon-error1'
        this.$notify({
          message,
          position: 'bottom-right',
          iconClass: 'icon iconfont ' + icon,
          duration: 1500
        })
        if (res) {
          /**
           * changePage表示是否更改查询页码
           * 删除成功会执行该函数重新查询列表
           * 如果被删除项目是当前页的第一个项目也是最后一个项目的话
           * changePage为true,否则为false
           */
          let changePage = false
          if (this.length === 1 && this.index === 0) changePage = true
          this.$emit('updateCount', -1) // 项目数-1
          this.$emit('getProjectBySearchItem', changePage) // 删除成功，触发父组件重新查询项目列表
        }
      })
    },
    recoverProject() {
      // 将项目恢复为未回收状态
      this.closeRecoverDialog()
      const id = this.projectInfo._id
      reqUserInfo.recoverProject(id).then(res => {
        const langRecoverDialog = this.langRecoverDialog
        const message = res ? langRecoverDialog.success : langRecoverDialog.fail
        const icon = res ? 'icon-success' : 'icon-error1'
        this.$notify({
          message,
          position: 'bottom-right',
          iconClass: 'icon iconfont ' + icon,
          duration: 1500
        })
        if (res) {
          /**
           * changePage表示是否更改查询页码
           * 恢复成功会执行该函数重新查询列表
           * 如果被恢复项目是当前页的第一个项目也是最后一个项目的话
           * changePage为true,否则为false
           */
          let changePage = false
          if (this.length === 1 && this.index === 0) changePage = true
          this.$emit('updateCount', 1) // 项目数+1
          this.$emit('getProjectBySearchItem', changePage) // 恢复成功，触发父组件重新查询项目列表
        }
      })
    }
  },
  components: {
    Loader
  }
}
</script>

<style lang="scss" src="./componentStyle/project.scss" scoped></style>
<style lang="scss" scoped>
.el-dropdown-menu {
  background-color: $primaryHued;
  border: none;
  color: $describe;
  overflow: hidden;
  & >>> .el-dropdown-menu__item {
    @include setTransition(all, 0.3s, ease);
    i {
      @include setTransition(all, 0.3s, ease);
    }
    &:hover {
      background-color: $deepColor;
      color: $afterFocus;
      i {
        color: $afterFocus;
      }
    }
  }
}
#project {
  @include setWAndH(360px, 250px);
  @include setTransition(all, 0.3s, ease);
  background-color: $primaryHued;
  border-radius: 5px;
  font-size: 14px;
  box-shadow: 0 0 5px 0 rgba(10, 10, 10, 0.5);
  overflow: hidden;
  &:hover {
    box-shadow: 0 0 10px 0 #bebebe;
  }
  .poster-box {
    position: relative;
    @include setWAndH(100%, 200px);
    &:hover .poster-screen {
      @include setWAndH(100%, 100%);
      opacity: 1;
    }
    .poster-screen {
      @include setWAndH(100%, 0px);
      @include setTransition(all, 0.3s, ease);
      opacity: 0;
      position: absolute;
      z-index: 20;
      background-color: rgba(0, 0, 0, 0.4);
      & > i {
        color: $afterFocus;
        opacity: 0.8;
        font-size: 40px;
        @include setTransition(all, 0.3s, ease);
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }
    }
    .poster-loader {
      @include setWAndH(200px, 200px);
      position: absolute;
      transform: translate(-50%, -50%) scale(0.4);
      left: 50%;
      top: 50%;
    }
    .poster {
      @include setWAndH(100%, 100%);
      cursor: pointer;
      background-color: #fff;
    }
  }
  .project-opt-box {
    @include setWAndH(100%, 50px);
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    color: $afterFocus;
    font-size: 16px;
    &:hover .rename {
      opacity: 1;
    }
    .rename {
      padding: 10px;
      color: $describe;
      opacity: 0;
      @include setTransition(all, 0.3s, ease);
      cursor: pointer;
      &:hover {
        color: $afterFocus;
        opacity: 1;
      }
    }
    .project-name {
      width: auto;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .project-title {
      .input-box {
        width: 0;
        border-bottom: 1px solid $describe;
        @include setTransition(all, 0.3s, ease);
      }
      .name-input {
        width: 200px;
        border: none;
        outline: none;
        color: $afterFocus;
        font-size: 16px;
        font-family: $josefinSans;
        background-color: transparent;
      }
    }
    .name-input:focus + .input-box {
      width: 100%;
    }
    .dropdown-menu {
      position: absolute;
      cursor: pointer;
      color: $describe;
      right: 10px;
      outline: none;
      &:hover {
        color: $afterFocus;
      }
    }
  }
  .delete-dialog,
  .tags-dialog,
  .recover-dialog {
    & >>> .el-dialog {
      background-color: $primaryHued;
      .el-dialog__title,
      .el-dialog__body {
        color: $afterFocus;
        font-size: 16px !important;
      }
      .el-button--danger {
        background-color: #ff3c41;
      }
      .el-dialog__headerbtn {
        display: none;
      }
    }
  }
  .tags-dialog {
    .tags-box {
      height: 50px;
      & >>> .el-tag {
        height: 35px;
        background-color: $deepColor;
        font-size: 16px;
        display: flex;
        align-items: center;
        margin-right: 5px;
        i {
          color: $describe;
          @include setTransition(all, 0.3s, ease);
          &:hover {
            background-color: $deepColor;
            color: $afterFocus;
          }
        }
      }
    }
    & >>> .el-dialog__body {
      padding: 20px;
    }
  }
}
</style>
