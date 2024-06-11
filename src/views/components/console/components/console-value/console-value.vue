<template>
  <div class="inline-flex flex-wrap console-common cursor-default">
    <div v-if="basicTypes.includes(type)" :class="`console-${type}`">
      <span>{{ value }}</span>
      <template v-if="type === 'string' && isLink">
        <template v-for="(item, index) in linkPos" :key="index">
          <span v-if="!index">{{ value.slice(0, item.start) }}</span>
          <a
            class="console-link cursor-pointer"
            :href="value.slice(item.start, item.end)"
            target="_blank"
          >{{ value.slice(item.start, item.end) }}</a>
          <span v-if="index < linkPos!.length - 1">{{ value.slice(item.end, linkPos![index + 1].start) }}</span>
        </template>
      </template>
    </div>
    <div v-else-if="type === 'Array'">
      <!-- ▶ (6) [{...}, 1, "123", true, ƒ, Array(0)] -->
      <span v-if="simple">Array({{ size }})</span>
      <console-fold v-else v-model="isFold">
        <template #default>
          <span v-if="size">({{ size }}) </span>
          <span>[</span>
          <template v-for="(item, index) in foldListData" :key="index">
            <span v-if="index">,&nbsp;</span>
            <console-value v-bind="item" simple></console-value>
          </template>
          <span v-if="minLength < size!"> ...</span>
          <span>]</span>
        </template>
        <template #content>
          <div v-for="(item, index) in unfoldListData" :key="index">
            <span class="console-attribute-name">{{ index }}</span>
            <span>:&nbsp;</span>
            <console-value v-bind="item"></console-value>
          </div>
          <div>length:&nbsp;<console-value type="number" :value="size"></console-value></div>
          <div v-if="maxLength < size!">{{ size! - maxLength }} more...</div>
        </template>
      </console-fold>
    </div>
    <div v-else-if="type === 'Object'">
      <span v-if="simple">{{ name === 'Object' ? "{...}" : name }}</span>
      <console-fold v-else v-model="isFold">
        <template #default>
          <span v-if="name">{{ name === 'Object' ? "" : name }} </span>
          <span>{</span>
          <template v-for="(item, index) in attrs" :key="index">
            <template v-if="index < minLength">
              <span v-if="index">,&nbsp;</span>
              <span class="console-attribute-name">{{ item.key }}</span>
              <span>:&nbsp;</span>
              <console-value v-bind="foldListData[index]" simple></console-value>
            </template>
          </template>
          <span v-if="minLength < attrs!.length">&nbsp;...</span>
          <span>}</span>
        </template>
        <template #content>
          <template v-for="(item, index) in attrs" :key="item.key">
            <div v-if="index < maxLength">
              <span class="console-attribute-name">{{ item.key }}</span>
              <span>:&nbsp;</span>
              <console-value v-bind="unfoldListData[index]"></console-value>
            </div>
          </template>
          <div v-if="maxLength < size!">{{ size! - maxLength }} more...</div>
        </template>
      </console-fold>
    </div>
    <div v-else-if="type === 'function'" class="fs-italic">
      <!-- ƒ a(){} -->
      <template v-if="simple">
        <span class="console-function-prefix">ƒ</span>
      </template>
      <template v-else>
        <span class="console-function-prefix">ƒ&nbsp;</span>
        <span class="console-function-code">{{ value }}</span>
      </template>
    </div>
    <div v-else-if="type === 'Map' || type === 'WeakMap'">
      <template v-if="simple">
        <span>{{ toStringTag }}</span>
        <span v-if="size">({{ size }})</span>
      </template>
      <console-fold v-else v-model="isFold">
        <template #default>
          <span>{{ toStringTag }}</span>
          <span v-if="size">({{ size }})</span>
          <span>{</span>
          <template v-for="(item, index) in foldMapData" :key="index">
            <span v-if="index">,&nbsp;</span>
            <console-value v-bind="item.key" simple></console-value>
            <span>&nbsp;=>&nbsp;</span>
            <console-value v-bind="item.value" simple></console-value>
          </template>
          <span v-if="minLength < (attrs?.length || 0)">&nbsp;...</span>
          <span>}</span>
        </template>
        <template #content>
          <div v-for="(item, index) in unfoldMapData" :key="index">
            <span class="console-attribute-name">{{ index }}</span>
            <span>:&nbsp;</span>
            <span>{</span>
            <console-value v-bind="item.key"></console-value>
            <span>&nbsp;=>&nbsp;</span>
            <console-value v-bind="item.value"></console-value>
            <span>}</span>
          </div>
          <div v-if="type === 'Map'">size:&nbsp;<console-value type="number" :value="size"></console-value></div>
          <div v-if="maxLength < size!">{{ size! - maxLength }} more...</div>
        </template>
      </console-fold>
    </div>
    <div v-else-if="type === 'Set' || type === 'WeakSet'">
      <template v-if="simple">
        <span>{{ toStringTag }}</span>
        <span v-if="size">({{ size }})</span>
      </template>
      <console-fold v-else v-model="isFold">
        <!-- ▶ Set(9) {{…}, Array(0), 3, 4, 5, …} -->
        <template #default>
          <span>{{ toStringTag }}</span>
          <span v-if="size">({{ size }})</span>
          <span>{</span>
          <template v-for="(item, index) in foldListData" :key="index">
            <span v-if="index">,&nbsp;</span>
            <console-value v-bind="item" simple></console-value>
          </template>
          <span v-if="minLength < attrs!.length">&nbsp;...</span>
          <span>}</span>
        </template>
        <template #content>
          <div v-for="(item, index) in unfoldListData" :key="index">
            <span class="console-attribute-name">{{ index }}</span>
            <span>:&nbsp;</span>
            <console-value v-bind="item"></console-value>
          </div>
          <div v-if="type === 'Set'">size:&nbsp;<console-value type="number" :value="size"></console-value></div>
          <div v-if="maxLength < size!">{{ size! - maxLength }} more...</div>
        </template>
      </console-fold>
    </div>
    <div v-else-if="toStringTag === 'Promise'">
      <span>{{ toStringTag }}</span>
      <span>&nbsp;{</span>
      <span class="console-promise-state">&lt;pending&gt;</span>
      <span>}</span>
    </div>
    <div v-else-if="type === 'NodeList'">
      <template v-if="simple">
        <span>{{ toStringTag }}</span>
        <span v-if="size">({{ size }})</span>
      </template>
      <console-fold v-else v-model="isFold">
        <template #default>
          <span>{{ toStringTag }}</span>
          <span v-if="size">({{ size }})</span>
          <span>[</span>
          <template v-for="(item, index) in foldListData" :key="index">
            <span v-if="index">,&nbsp;</span>
            <console-value v-bind="item" simple></console-value>
          </template>
          <span v-if="minLength < value.length">&nbsp;...</span>
          <span>]</span>
        </template>
        <template #content>
          <div v-for="(item, index) in unfoldListData" :key="index">
            <span class="console-attribute-name">{{ index }}</span>
            <span>:&nbsp;</span>
            <console-value v-bind="item" simple></console-value>
          </div>
          <div v-if="maxLength < size!">{{ size! - maxLength }} more...</div>
        </template>
      </console-fold>
    </div>
    <div v-else-if="type === 'Element'">
      <div v-if="simple" class="fs-italic">
        <span class="console-element-name">{{ name }}</span>
        <span v-if="suffix" class="console-element-suffix">{{ suffix }}</span>
      </div>
      <template v-else>
        <span class="console-element-name">&lt;{{ name }}</span>
        <template v-for="attr in attrs" :key="attr.key">
          <span class="console-attribute-name">&nbsp;{{ attr.key }}</span>
          <span>="</span>
          <span class="console-attribute-value">{{ attr.value }}</span>
          <span>"</span>
        </template>
        <span class="console-element-name">&gt;</span>
        <span>...</span>
        <span class="console-element-name">&lt;/{{ name }}&gt;</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IConsoleValueMapData, IProps } from "./console-value"
import ConsoleFold from "../console-fold/console-fold.vue"
import { ref } from "vue"
import { formatConsoleValue } from "@utils/tools/console-value"
import { IConsoleValue } from "@type/console"
import { basicTypes } from "@utils/tools"

const props = withDefaults(defineProps<IProps>(), {
  minLength: Infinity,
  maxLength: Infinity,
  simple: false,
})
const isFold = ref<boolean>(false)

/** 展示的数据（缩起） */
const foldListData: IConsoleValue[] = []
/** 展示的数据（展开） */
const unfoldListData: IConsoleValue[] = []
/** 展示的键值对数据（缩起） */
const foldMapData: IConsoleValueMapData[] = []
/** 展示的键值对数据（展开） */
const unfoldMapData: IConsoleValueMapData[] = []
// eslint-disable-next-line max-lines-per-function
const setFoldData = () => {
  const { type, value, attrs = [], minLength, maxLength, size = 0 } = props
  switch(type) {
    case "Array": {
      const loopTime = Math.min(size, maxLength)
      for (let i = 0; i < loopTime; i ++) {
        const result = formatConsoleValue(value[i])
        if (i < minLength) {
          foldListData.push(result)
        }
        unfoldListData.push(result)
      }
      break
    }
    case "Object": {
      const loopTime = Math.min(attrs.length, maxLength)
      for (let i = 0; i < loopTime; i ++) {
        const result = formatConsoleValue(attrs[i].value)
        if (i < minLength) {
          foldListData.push(result)
        }
        unfoldListData.push(result)
      }
      break
    }
    case "Map":
    case "WeakMap": {
      const loopTime = Math.min(attrs.length, maxLength)
      for (let i = 0; i < loopTime; i ++) {
        const result = {
          key: formatConsoleValue(attrs[i].key),
          value: formatConsoleValue(attrs[i].value),
        }
        if (i < minLength) {
          foldMapData.push(result)
        }
        unfoldMapData.push(result)
      }
      break
    }
    case "Set":
    case "WeakSet": {
      const loopTime = Math.min(attrs.length, maxLength)
      for (let i = 0; i < loopTime; i ++) {
        const result = formatConsoleValue(attrs[i].value)
        if (i < minLength) {
          foldListData.push(result)
        }
        unfoldListData.push(result)
      }
      break
    }
    case "NodeList": {
      const loopTime = Math.min(value.length, maxLength)
      for (let i = 0; i < loopTime; i ++) {
        const result = formatConsoleValue(value[i])
        if (i < minLength) {
          foldListData.push(result)
        }
        unfoldListData.push(result)
      }
      break
    }
    default: {}
  }
}

const initData = () => {
  setFoldData()
}

initData()
</script>

<style src="./console-value.scss" lang="scss" scoped></style>