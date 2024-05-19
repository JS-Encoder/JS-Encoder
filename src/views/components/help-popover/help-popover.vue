<script lang="ts" setup>
import Popover from "@components/popover/popover.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import { BtnType, Size } from "@type/interface"

interface IProps {
  /** 说明文字 */
  describe: string
  /** 查看更多跳转的路径 */
  viewTarget?: string
  /** extends component popover */
}

const props = defineProps<IProps>()
</script>

<template>
  <popover offset="8" level="500" v-bind="$attrs">
    <div class="cursor-pointer">
      <i class="icon iconfont icon-help font-s primary1-text"></i>
    </div>
    <template v-slot:content>
      <div class="flex-col">
        <span class="font-xxs describe-text renew-line-s">{{describe}}</span>
        <div class="text-right" v-if="viewTarget">
          <custom-button :type="BtnType.PRIMARY" :size="Size.SMALL">查看更多</custom-button>
        </div>
      </div>
    </template>
  </popover>
</template>

<style lang="scss" scoped></style>