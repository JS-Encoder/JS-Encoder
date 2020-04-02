<template>
  <div id="profileBody" class="profileBody flex flex-clo flex-ai noselect" v-if="refresh">
    <header id="header">
      <div class="header-content flex flex-jcc">
        <div class="user-profile flex flex-ai">
          <img class="avatar" :src="userInfo.avatarUrl" alt="">
          <div class="username">
            <span class="name ellipsis-text" :title="userInfo.name">{{userInfo.name}}</span>
            <span class="nickname ellipsis-text" :title="userInfo.nickName">@{{userInfo.nickName}}</span>
          </div>
        </div>
        <span class="project-num">{{langProfileInfo.projectNum}}{{count}}</span>
        <span class="recycle-num">{{langProfileInfo.recycleNum}}{{recycleCount}}</span>
      </div>
      <div class="project-types flex flex-jcb">
        <div class="type flex flex-ai flex-jcc" :title="langProjectType[0]" :class="!type?'project-types-active':''"
          @click="type = false">
          <i class="icon iconfont icon-xiangmu"></i>
        </div>
        <div class="type flex flex-ai flex-jcc" :title="langProjectType[1]" :class="type?'project-types-active':''"
          @click="type = true">
          <i class="icon iconfont icon-recyclebin"></i>
        </div>
        <div class="type flex flex-ai flex-jcc" :title="langProjectType[2]"
          :class="showSearch?'project-types-active':''" @click="showSearch=!showSearch">
          <i class="icon iconfont icon-sousuo"></i>
        </div>
      </div>
    </header>
    <div class="filters flex flex-jcb flex-w" v-show="showSearch">
      <el-input class="filter-search" :placeholder="langFilter.search.placeholder" v-model="searchName" size="medium">
        <template class="search-prepend" slot="prepend">{{langFilter.search.name}}</template>
        <el-button slot="append" icon="el-icon-search" @click="getProjectBySearchItem"></el-button>
      </el-input>
      <div class="filter-tags flex">
        <div class="tags-prepend flex flex-ai flex-jcc">{{langFilter.tags.name}}</div>
        <el-select class="tags-select" v-model="tagsList" multiple filterable allow-create default-first-option
          :placeholder="langFilter.tags.placeholder" @visible-change="foldTagsSearch($event)">
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="filter-sort flex">
        <div class="sort-prepend flex flex-ai flex-jcc">{{langFilter.sort.name}}</div>
        <el-select class="sort-select" v-model="sort" :placeholder="langFilter.sort.placeholder">
          <el-option v-for="item in langSortList" :key="item.label" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-order flex">
        <div class="order-prepend flex flex-ai flex-jcc">{{langFilter.order.name}}</div>
        <div class="order-up flex flex-ai flex-jcc" :class="orderBy===1?'activeOrder':''" @click="orderBy=1">
          <i class="el-icon-arrow-up"></i>
        </div>
        <div class="order-down flex flex-ai flex-jcc" :class="orderBy===-1?'activeOrder':''" @click="orderBy=-1">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </div>
    <div class="project">
      <div class="loader-screen" v-show="showLoader">
        <Loader class="loader"></Loader>
      </div>
      <div class="blank-tip flex flex-jcc" v-if="!projectList.length">
        <span v-show="!type">{{langProfileInfo.blankTip}}</span>
        <span v-show="!type" class="create" @click="showCreate">{{langProfileInfo.create}}</span>
        <span v-show="type">{{langProfileInfo.blankCycle}}</span>
      </div>
      <Project v-for="(item,index) in projectList" :key="item._id" :projectInfo="item"
        @getProjectBySearchItem="getProjectBySearchItem" @updateCount="updateCount" @getAllTags="getAllTags"
        :length="projectList.length" :index="index"></Project>
    </div>
    <el-pagination v-show="count>12" class="pagination" background layout="prev, pager, next" :total="count"
      :page-size="12" @current-change="handleCurrentChange"></el-pagination>
    <Support></Support>
    <EncoderFooter class="encoder-footer"></EncoderFooter>
  </div>
</template>

<script>
import Project from './project.vue'
import reqUserInfo from '@/utils/requestUserInfo'
import handleCookie from '@/utils/handleCookie'
import EncoderFooter from './encoderFooter'
import Support from './support'
import Loader from './load'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      type: false,
      refresh: true,
      searchName: '',
      options: [],
      tagsList: [],
      sort: '',
      projectList: [],
      langProfileInfo: window.Global.language.profileInfo,
      orderBy: 1,
      page: 0,
      showSearch: false,
      showLoader: true,
      tagsChanged: false,
      count: 0,
      recycleCount: 0
    }
  },
  mounted() {
    let projectType = this.$route.query.projectType
    typeof projectType === 'string' &&
      (projectType = projectType === 'false' ? false : true)
    // 获取项目列表
    if (!projectType) {
      this.getProjectList(false)
    } else {
      this.type = projectType
    }
    // 获取项目标签列表
    this.getCount(false)
    this.getCount(true)
    this.getAllTags()
  },
  computed: {
    ...mapState({
      language: 'language',
      userInfo: 'userInfo'
    }),
    langFilter() {
      return this.langProfileInfo.filter
    },
    langSortList() {
      return this.langFilter.sort.sortList
    },
    langProjectType() {
      return this.langProfileInfo.projectType
    },
    calcPages() {
      // 根据项目总数计算页数
      const count = this.count
      let pages = Math.ceil(count / 12)
      pages - 1 < 0 && (pages = 0)
      return pages
    }
  },
  watch: {
    language() {
      // 重新渲染组件
      this.refresh = false
      this.$nextTick(() => {
        this.langProfileInfo = window.Global.language.profileInfo
        this.refresh = true
      })
    },
    type(newVal) {
      // type改变之后，page置为0
      this.page = 0
      this.getProjectBySearchItem()
    },
    tagsList(newVal, oldVal) {
      // 标签变化，执行条件搜索
      if (newVal.length < oldVal.length) this.getProjectBySearchItem()
      else this.tagsChanged = true
    },
    orderBy() {
      // 顺序变化，执行条件搜索
      this.getProjectBySearchItem()
    },
    sort() {
      // 排序方式变化，执行条件搜索
      this.getProjectBySearchItem()
    },
    page() {
      // page改变了需要返回页面顶部，利用锚点
      const a = document.createElement('a')
      a.href = '#header'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  },
  methods: {
    foldTagsSearch(e) {
      if (e || !this.tagsChanged) return void 0
      this.getProjectBySearchItem()
    },
    getProjectList(status) {
      // 获取项目，回收站列表
      // status: false代表项目，true代表回收站
      const userId = handleCookie.getCookieValue('_id')
      reqUserInfo.getProjectInfo(userId, status).then(res => {
        this.projectList = res
        setTimeout(() => {
          this.showLoader = false
        }, 500)
      })
    },
    getCount(status) {
      // 获取项目数量
      const userId = handleCookie.getCookieValue('_id')
      reqUserInfo.getProjectsCount(userId, status).then(count => {
        if (count >= 0) {
          if (status) this.recycleCount = count
          else this.count = count
        }
      })
    },
    getProjectBySearchItem(changePage) {
      /**
       * 页码查询策略
       * 当用户删除一个项目时会执行该函数重新查询列表
       * 如果被删除项目是当前页的第一个项目也是最后一个项目的话
       * page应向前一页查询，如果page已经为0，不改变page
       */
      this.showLoader = true
      const userId = handleCookie.getCookieValue('_id')
      const status = this.type // 是否放入回收站
      const name = this.searchName // 项目名
      const tagsList = JSON.stringify(this.tagsList) // 标签列表
      const sort = this.sort // 排序方式
      const orderBy = this.orderBy // 排序顺序，1为顺序，-1为倒序
      if (changePage && this.page > 0) this.page--
      const page = this.page // 页码
      reqUserInfo
        .getProjectBySearch({
          userId,
          page,
          name,
          tagsList,
          sort,
          orderBy,
          status
        })
        .then(res => {
          this.projectList = res
          this.tagsChanged = false
          setTimeout(() => {
            this.showLoader = false
          }, 500)
        })
    },
    showCreate() {
      // 显示创建项目窗口
      const commit = this.$store.commit
      commit('updateShowBg', true)
      commit('updateCurrentDialog', 'newProject')
    },
    getAllTags() {
      // 获取所有项目标签（不重复）
      const userId = handleCookie.getCookieValue('_id')
      reqUserInfo.getAllTags(userId).then(res => {
        if (res) {
          this.options = res
        }
      })
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage - 1
      this.getProjectBySearchItem()
    },
    updateCount(changeCount) {
      this.count += changeCount
      this.recycleCount -= changeCount
    }
  },
  components: {
    Project,
    EncoderFooter,
    Loader,
    Support
  }
}
</script>
<style lang="scss" src="./componentStyle/profileBody.scss" scoped></style>
<style lang="scss" scoped>
#profileBody {
  @include setWAndH(100%, 100%);
  overflow: auto !important;
  @include keyframes(fade-opt) {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @include keyframes(fade) {
    from {
      opacity: 0;
      margin-left: 20px;
    }
    to {
      opacity: 1;
      margin-left: 0;
    }
  }
  @include keyframes(up) {
    from {
      opacity: 0;
      margin-top: 20px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
  @include keyframes(filters-up) {
    from {
      opacity: 0;
      margin-top: 30px;
    }
    to {
      opacity: 1;
      margin-top: 10px;
    }
  }
  header {
    @include setWAndH(100%, 160px);
    position: relative;
    flex-shrink: 0;
    .header-content {
      @include setWAndH(100%, 80px);
      @include animation(fade-opt, 0.3s, ease, 0.3s, forwards);
      opacity: 0;
      background-color: $primaryHued;
      position: relative;
      box-shadow: 10px 20px 20px 0px rgba(10, 10, 10, 0.5);
      .user-profile {
        position: absolute;
        top: 20px;
        .avatar {
          @include setWAndH(120px, 120px);
          box-sizing: border-box;
          border-radius: 50%;
          border: 2px solid $afterFocus;
          margin-right: 20px;
          opacity: 0;
          @include setTransition(all, 0.5s, ease);
          @include animation(fade, 0.5s, ease, 0.3s, forwards);
          box-shadow: 0 12px 12px 0px rgba(10, 10, 10, 0.5);
        }
        .username {
          @include setWAndH(150px, 60px);
          .name,
          .nickname {
            width: 100%;
            display: block;
            cursor: pointer;
            opacity: 0;
          }
          .name {
            color: $afterFocus;
            font-size: 25px;
            margin-bottom: 10px;
            @include animation(fade, 0.5s, ease, 0.6s, forwards);
          }
          .nickname {
            color: $describe;
            font-size: 16px;
            margin-top: 10px;
            @include animation(fade, 0.5s, ease, 0.8s, forwards);
          }
        }
      }
      .project-num,
      .recycle-num {
        font-size: 14px;
        color: $beforeFocus;
        position: absolute;
        opacity: 0;
        @include animation(fade, 0.5s, ease, 0.3s, forwards);
      }
      .project-num {
        top: calc(100% - 20px);
        right: 80px;
      }
      .recycle-num {
        top: calc(100% + 5px);
        right: 80px;
      }
    }
    .project-types {
      @include setWAndH(165px, 50px);
      margin-left: 30px;
      position: absolute;
      bottom: 0;
      .type {
        @include setWAndH(50px, 50px);
        opacity: 0;
        border-radius: 5px;
        box-shadow: 0 0 5px 0 rgba(10, 10, 10, 0.5);
        background-color: $primaryHued;
        @include animation(up, 0.9s, ease, 0.3s, forwards);
        cursor: pointer;
        & > i {
          font-size: 30px;
          color: $describe;
          @include setTransition(all, 0.3s, ease);
          &:hover {
            color: $afterFocus;
          }
        }
      }
    }
    .project-types-active {
      background-color: $deepColor !important;
      & > i {
        color: $afterFocus !important;
      }
    }
  }
  .filters {
    margin: 10px 0px;
    @include setWAndH(calc(100% - 60px), 36px);
    .filter-search {
      @include setWAndH(400px, 36px);
      box-shadow: 0 0 5px 0 rgba(10, 10, 10, 0.5);
      .search-prepend {
        font-size: 14px;
      }
    }
    .filter-tags {
      @include setWAndH(400px, 36px);
      box-shadow: 0 0 5px 0 rgba(10, 10, 10, 0.5);
      .tags-prepend {
        @include setWAndH(64px, 100%);
        font-size: 14px;
        color: $afterFocus;
        background-color: $primaryHued;
        border-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .tags-select {
        @include setWAndH(100%, 36px);
        & >>> .el-input__inner {
          height: 100% !important;
          border-radius: 5px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        & >>> .el-input {
          height: 100%;
        }
      }
    }
    .filter-sort {
      @include setWAndH(225px, 36px);
      box-shadow: 0 0 5px 0 rgba(10, 10, 10, 0.5);
      .sort-prepend {
        font-size: 14px;
        @include setWAndH(64px, 100%);
        color: $afterFocus;
        background-color: $primaryHued;
        border-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .sort-select {
        @include setWAndH(100%, auto);
        & >>> .el-input__inner {
          border-radius: 5px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
    .filter-order {
      @include setWAndH(164px, 36px);
      box-shadow: 0 0 5px 0 rgba(10, 10, 10, 0.5);
      .order-prepend {
        font-size: 14px;
        @include setWAndH(225px, auto);
        @include setWAndH(64px, 100%);
        color: $afterFocus;
        background-color: $primaryHued;
        border-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .order-up,
      .order-down {
        @include setWAndH(50px, 100%);
        background-color: $primaryHued;
        @include setTransition(all, 0.3s, ease);
        cursor: pointer;
        & > i {
          font-size: 20px;
          color: $describe;
          @include setTransition(all, 0.3s, ease);
          &:hover {
            color: $afterFocus;
          }
        }
      }
      .order-down {
        border-radius: 5px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .activeOrder {
        background-color: $afterFocus;
        color: $describe;
      }
    }
  }
  .project {
    @include setWAndH(calc(100% - 60px), auto);
    @include animation(filters-up, 0.3s, ease, 1.2s, forwards);
    flex-shrink: 0;
    min-height: 100%;
    opacity: 0;
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat(auto-fill, 360px);
    grid-row-gap: 30px;
    grid-template-rows: repeat(auto-fill, 250px);
    position: relative;
    .loader-screen {
      @include setWAndH(100%, 100%);
      position: absolute;
      z-index: 9;
      background-color: $dominantHue;
    }
    .loader {
      @include setWAndH(200px, 200px);
      position: absolute;
      left: 50%;
      top: 200px;
      transform: translate(-50%, -50%) scale(0.6);
      z-index: 10;
    }
    .blank-tip {
      @include setWAndH(100%, auto);
      margin-top: 150px;
      position: absolute;
      color: $describe;
      .create {
        color: #75beff;
        text-decoration: underline;
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
  .pagination {
    padding-top: 50px;
    margin-bottom: 100px;
    @include animation(filters-up, 0.3s, ease, 1.5s, forwards);
    opacity: 0;
    flex-shrink: 0;
    & >>> li,
    & >>> button {
      @include setTransition(all, 0.3s, ease);
      @include setWAndH(30px, 30px);
      margin: 0 5px;
      border-radius: 5px;
      background-color: $primaryHued;
      border: none;
      color: $describe;
      &:hover {
        color: $afterFocus;
      }
    }
    & >>> .active {
      background-color: $deepColor;
      color: $afterFocus;
    }
  }
  .encoder-footer {
    @include animation(filters-up, 0.3s, ease, 1.8s, forwards);
    opacity: 0;
  }
}
</style>