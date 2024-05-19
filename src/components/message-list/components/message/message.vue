<template>
  <li
    class="shadow radius-l flex-sh flex-nowrap bg-main1 font-xs flex-y-center p-x-l p-y-s mt-s"
    :class="namespace"
    :style="{ color: messageType2InfoMap[type].color, ...customStyle || {} }">
    <i class="icon iconfont" :class="messageType2InfoMap[type].icon"></i>
    <span class="active-text ml-l">{{ text }}</span>
  </li>
</template>

<script setup lang="ts">
import { IMessageEmits, IMessageProps, MessageType } from "@components/message-list/message-list.interface"
import { messageType2InfoMap } from "./message"
import { onMounted } from "vue"

const namespace = "message"

const props = withDefaults(defineProps<IMessageProps>(), {
  type: MessageType.NOTICE,
  text: "",
  duration: 3000,
})
const emits = defineEmits<IMessageEmits>()

onMounted(() => {
  setTimeout(() => {
    emits("close")
  }, props.duration)
})
</script>

<style lang="scss" scoped>
$namespace: "message";

.#{$namespace} {
  width: max-content;
}
</style>