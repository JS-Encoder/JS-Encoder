<template>
  <router-view></router-view>
  <screen-loading v-if="pageLoading"></screen-loading>
</template>

<script setup lang="ts">
import { DBService } from "@utils/services/indexed-db-service"
import { dbConfig } from "@utils/config/indexed-db"
import ScreenLoading from "@views/components/screen-loading/screen-loading.vue"
import { useCommonStore } from "@store/common"
import { storeToRefs } from "pinia"

const commonStore = useCommonStore()
const { pageLoading } = storeToRefs(commonStore)

// 连接数据库
new DBService(dbConfig).init()
</script>

<style lang="scss">
#app {
  background-color: var(--color-main-bg-3);
}
</style>
