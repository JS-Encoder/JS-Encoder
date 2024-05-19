<template>
  <teleport to="body">
    <transition :name="namespace" appear>
      <mask-layer v-if="modelValue" @click-mask="handleClickMask">
        <div
          class="p-xxl radius-l bg-main2 absolute shadow flex-col"
          :class="namespace"
          :style="{
            width: width ? `${width}px` : 'auto',
            top: `${top}px`,
            maxHeight: `calc(100vh - ${top}px - ${bottom}px)`
          }">
          <div class="flex-y-center pb-l" :class="`${namespace}-header`">
            <span class="fw-bold no-select" :class="`${namespace}-title`">{{title}}</span>
            <div class="flex-1"></div>
            <i
              v-if="showClose"
              class="icon iconfont icon-close cursor-pointer fade-ease text-hover-active"
              @click.stop="handleCloseModal"
            ></i>
          </div>
          <div class="over-y-auto flex-1" :class="`${namespace}-content`">
            <slot></slot>
          </div>
          <div class="pt-l text-right" :class="`${namespace}-footer`" v-if="showFooter">
            <slot v-if="slots.footer" name="footer"></slot>
            <div v-else class="pt-l text-right">
              <custom-button
                class="mr-s"
                v-if="showCancel"
                v-bind="cancelBtnOpts"
                @click="$emit('cancel')"
              >{{cancelText}}</custom-button>
              <custom-button
                v-bind="{ ...defaultConfirmBtnOpts, ...confirmBtnOpts }"
                @click="$emit('confirm')"
              >{{okText}}</custom-button>
            </div>
          </div>
        </div>
      </mask-layer>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import MaskLayer from "@components/mask-layer/mask-layer.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import { toRef, useSlots } from "vue"
import useEscClose from "@hooks/use-esc-close"
import { BtnType } from "@type/interface"
import { IEmits, IProps } from "./modal"

const defaultConfirmBtnOpts = {
  type: BtnType.PRIMARY,
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: true,
  title: "示例标题",
  escCloseable: true,
  maskClosable: true,
  okText: "确认",
  showCancel: false,
  showClose: true,
  cancelText: "取消",
  showFooter: true,
  top: 150,
  bottom: 150,
  confirmBtnOpts: () => ({}),
})

const emits = defineEmits<IEmits>()

const slots = useSlots()

const namespace = "modal"

const closeModal = (): void => {
  emits("close")
  emits("update:modelValue", false)
}

useEscClose(toRef(props, "escCloseable"), () => {
  if (!props.modelValue) { return }
  closeModal()
})

const handleClickMask = (): void => {
  if (!props.maskClosable) { return }
  closeModal()
}

const handleCloseModal = (): void => {
  closeModal()
}
</script>

<style lang="scss" scoped>
$namespace: "modal";

.#{$namespace} {
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid var(--color-modal-def-border);
  .#{$namespace}-header {
    .#{$namespace}-title {
      font-size: 18px;
      color: var(--color-active-color);
    }
  }
  .#{$namespace}-content {
    &::-webkit-scrollbar {
      width: 24px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-left: 16px solid transparent;
      background-clip: padding-box;
      background-color: var(--color-main-bg-1);
    }
    &::-webkit-scrollbar-track {
      background-color: var(--color-main-bg-2);
    }
  }
}

.#{$namespace}-enter-active,
.#{$namespace}-leave-active {
  transition: all 0.2s ease;
}
.#{$namespace}-enter-from,
.#{$namespace}-leave-to {
  opacity: 0;
  transform: scale(1.05);
  .mask-layer {
    backdrop-filter: blur(0);
  }
}
</style>