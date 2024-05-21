<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { DBService } from "@utils/services/indexed-db-service"
import { dbConfig } from "@utils/config/indexed-db"

// 连接数据库
new DBService(dbConfig).init()
</script>

<style lang="scss">
#app {
  background-color: var(--color-main-bg-3);
}
</style>
