<template>
  <div
    class="console-item pl-xs pr-xxl p-y-xs font-xxs flex"
    :class="[`console-${logInfo.type}`]">
    <!-- icon -->
    <div class="inline-flex flex-center mr-xs">
      <i class="console-item-icon icon iconfont font-xxs" :class="logType2Icon[logInfo.type]"></i>
    </div>
    <!-- value -->
    <div v-if="logInfo.method === ConsoleMethods.TABLE" class="flex-wrap flex-1">
      <console-table
        v-if="logInfo.method === ConsoleMethods.TABLE"
        v-bind="logInfo.data"
      ></console-table>
      <console-value v-bind="formatConsoleValue(logInfo.origin)"></console-value>
    </div>
    <div v-else>
      <template v-for="(item, index) in logInfo.data" :key="index">
        <span v-if="index">&nbsp;</span>
        <console-value v-bind="item"></console-value>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConsoleMethods } from "@type/console"
import ConsoleTable from "../console-table/console-table.vue"
import { IProps, logType2Icon } from "./console-item"
import ConsoleValue from "../console-value/console-value.vue"
import { formatConsoleValue } from "@utils/tools/console-value"

const props = defineProps<IProps>()
</script>

<style src="./console-item.scss" lang="scss" scoped></style>