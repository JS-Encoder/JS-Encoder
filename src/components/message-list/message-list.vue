<template>
  <transition-group
    name="message-fade"
    tag="ul"
    class="fixed flex-col-center"
    :class="namespace">
    <template v-for="item in messageList" :key="item.id">
      <message
        :text="item.text"
        :type="item.type"
        :duration="item.duration"
        :custom-style="item.customStyle"
        @close="emits('close', item.id)">
      </message>
    </template>
  </transition-group>
</template>

<script setup lang="ts">
import Message from "./components/message/message.vue"
import { IMessageListEmits, IMessageListProps } from "./message-list.interface"

const namespace = "message-list"
defineProps<IMessageListProps>()

const emits = defineEmits<IMessageListEmits>()
</script>

<style lang="scss">
$namespace: "message-list";
$transition-name: "message-fade";

.#{$namespace} {
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  z-index: 2000;
}
.#{$transition-name}-move,
.#{$transition-name}-enter-active,
.#{$transition-name}-leave-active {
  transition: all 0.2s cubic-bezier(0, 0, 1, 1);
}
.#{$transition-name}-enter-from,
.#{$transition-name}-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.#{$transition-name}-leave-active {
  position: absolute;
}
</style>