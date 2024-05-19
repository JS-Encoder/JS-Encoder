<template>
  <transition-group name="drag">
    <div
      v-for="(item, index) in modelValue"
      :draggable="disabled ? 'false' : 'true'"
      :class="[dragIndex === index ? 'dragging' : '']"
      :key="item[uniqueKey]"
      :data-drag-sortable="true"
      :data-group="group"
      @dragstart="handleDragstart($event, index)"
      @dragend.prevent="handleDragend()"
      @dragenter.prevent="handleDragenter($event, index)"
      @dragover.prevent="() => {}">
      <!-- 外部传入的可拖拽项列表 -->
      <slot :name="`item-${item[uniqueKey]}`"></slot>
    </div>
  </transition-group>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import { IEmits, IProps } from "./drag-sortable"
import { AnyArray } from "@type/interface"
import DragSortableService from "./drag-sortable-service"

const props = withDefaults(defineProps<IProps>(), {
  modelValue: () => [],
  disabled: false,
})
const emits = defineEmits<IEmits>()

const dragSortableService = new DragSortableService()

let list: AnyArray = [...props.modelValue]
watchEffect(() => {
  /** 浅复制一份传入的数组 */
  list = [...props.modelValue]
})

const dragIndex = ref<number>(-1)
const handleDragstart = (event: DragEvent, index: number) => {
  dragIndex.value = index
  const group = (event.target as HTMLElement).dataset.group
  dragSortableService.setDraggingGroup(group || "")
}
const handleDragend = () => {
  dragIndex.value = -1
  dragSortableService.setDraggingGroup("")
}
const handleDragenter = (event: DragEvent, index: number) => {
  if (index === undefined
    || dragIndex.value === index
    || !dragSortableService.judgeSameGroup(event.target as HTMLElement)
  ) { return }
  const dragItem = list[dragIndex.value]
  list.splice(dragIndex.value, 1)
  list.splice(index, 0, dragItem)
  dragIndex.value = index
  emits("update:modelValue", [...list])
}
</script>

<style lang="scss" scoped>
.drag-move {
  transition: transform 0.3s;
}
.dragging {
  opacity: 0.5;
}
</style>