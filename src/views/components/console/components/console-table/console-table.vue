<template>
  <div class="fill-w">
    <table class="fill-w" :class="namespace">
      <thead class="text-left" :class="`${namespace}-header`">
        <tr>
          <th class="p-x-xs" v-for="title in headers" :key="title">{{ title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in body" :key="index">
          <template v-for="(value, index) in row" :key="index">
            <td v-if="index" class="p-x-xs">
              <console-value v-bind="formatConsoleValue(value, true)" simple></console-value>
            </td>
            <td v-else class="p-x-xs">{{ value }}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { formatConsoleValue } from "@utils/tools/console-value"
import ConsoleValue from "../console-value/console-value.vue"

import { IProps } from "./console-table"

const props = defineProps<IProps>()

const namespace = "console-table"

</script>

<style lang="scss" scoped>
$namespace: "console-table";

.#{$namespace} {
  border-collapse: collapse;
  th {
    background-color: var(--color-console-table-header-bg);
  }
  th, td {
    border: 1px solid var(--color-console-table-border);
    color: var(--color-console-table-color);
    font-weight: normal;
  }
  td {
    border-top: none;
    border-bottom: none;
  }
  tbody tr:last-child td {
    border-bottom: 1px solid var(--color-console-table-border);
  }
}
</style>