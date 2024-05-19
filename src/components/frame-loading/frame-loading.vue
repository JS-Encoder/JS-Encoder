<template>
  <div class="font-m flex-col no-active-text fw-bold code-font" :class="namespace">
    <span class="font-no-ligatures text-pre-wrap">{{frames[currFrameIdx]}}</span>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from "vue"

const namespace = "frame-loading"

const frames = [
  "[        ]",
  "[=       ]",
  "[==      ]",
  "[===     ]",
  "[====    ]",
  "[=====   ]",
  "[ =====  ]",
  "[  ===== ]",
  "[   =====]",
  "[    ====]",
  "[     ===]",
  "[      ==]",
  "[       =]",
  "[        ]",
]
/** 动画周期总时间 */
const CYCLE_TIME = 1000
const START_INDEX = 0
const timeGap = Math.floor(CYCLE_TIME / frames.length)
const currFrameIdx = ref<number>(START_INDEX)

const timer: NodeJS.Timer = setInterval(() => {
  currFrameIdx.value = currFrameIdx.value < frames.length - 1 ? ++ currFrameIdx.value : START_INDEX
}, timeGap)

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
$namespace: "frame-loading";

.#{$namespace} {
  animation: shinning 2s ease infinite;
}

@keyframes shinning {
  50% {
    color: var(--color-describe);
  }
}
</style>