<template>
  <div class="profile flex">
    <fixedSlider :sliderConf="sliderConf"></fixedSlider>
    <div class="profile-page flex flex-clo">
      <profileHeader :accountInfo="accountInfo"></profileHeader>
      <div class="profile-works">
        <div class="works-title">
          <el-tabs @tab-click="handleClick" v-model="activeName">
            <el-tab-pane class="flex flex-w flex-jca" label="Works" name="Works">
              <work :key="index" v-for="(item, index) in worksInfo" :info="item" class="work" :class="'work'+index"></work>
            </el-tab-pane>
          </el-tabs>
          <div class="work-list"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fixedSlider from './fixedSlider.vue'
import profileHeader from './profileHeader.vue'
import work from './work.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      sliderConf: {
        event: 'triggerOpt',
        options: [
          {
            title: 'new editor',
            icon: 'icon iconfont icon-editor'
          },
          {
            title: 'recyle bin',
            icon: 'icon iconfont icon-recycle'
          },
          {
            title: 'log out',
            icon: 'icon iconfont icon-logOut'
          }
        ]
      },
      activeName: 'Works',
      worksInfo: []
    }
  },
  created() {
    const arr = []
    for (let i = 0; i < 12; i++) {
      arr.push({
        name: 'project name',
        id: i
      })
    }
    this.worksInfo = arr
  },
  components: {
    fixedSlider,
    profileHeader,
    work
  },
  computed: {
    ...mapState({
      accountInfo: 'accountInfo'
    })
  },
  methods: {
    handleClick(tab, event) {

    }
  }
}
</script>
<style lang="scss" >
.el-tabs__item {
  font-size: 16px !important;
}
.profile {
  @include setWAndH(100%, 100%);
  font-family: $josefinSans;
  overflow: auto;
  .profile-page {
    @include setWAndH(100%, auto);
    margin-left: 240px;
    .profile-works {
      padding: 10px 50px 50px 50px;
      box-sizing: border-box;
      @for $i from 0 through 12 {
        .work#{$i}{
          opacity: 0;
          animation: slide 1s ease 0.1s * ($i + 1) 1 normal;
          animation-fill-mode : forwards;
        }
      }
      @keyframes slide {
        from{
          opacity: 0;
          margin-top: 50px;
        }
        to{
          opacity: 1;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>