<template>
  <button
    class="cursor-pointer flex-center no-select fade-ease"
    :class="[
      `${namespace}`,
      `${namespace}--${size}`,
      `${namespace}--${type}`,
      icon ? `${namespace}-only-icon` : '',
      isDisabled ? `${namespace}-disabled` : '',
      shadow ? `shadow` : '',
      outline ? `${namespace}-outline` : '',
      radius ? `${namespace}-radius` : '',
      fill ? 'flex fill-w' : 'inline-flex',
      customClass,
    ]"
    :disabled="isDisabled"
    @click.stop="$emit('click')">
    <span class="border-box" :class="`${namespace}-load`" v-show="loading"></span>
    <span class="inline-block" :class="`${namespace}-content ${loading ? 'ml-s' : ''}`">
      <i v-if="icon || showIcon" :class="`${namespace}-icon icon iconfont ${iconClass}`"></i>
      <slot v-if="!icon"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { BtnType, Size } from "@type/interface"
import { IEmits, IProps } from "./custom-button"

const props = withDefaults(defineProps<IProps>(), {
  size: Size.MEDIUM,
  disabled: false,
  type: BtnType.DEFAULT,
  icon: false,
  iconClass: "",
  showIcon: false,
  shadow: false,
  outline: false,
  loading: false,
  radius: false,
  fill: false,
  customClass: "",
})

const emits = defineEmits<IEmits>()

const isDisabled = computed(() => props.loading || props.disabled)

const namespace = "custom-button"
</script>

<style src="./custom-button.scss" lang="scss" scoped></style>