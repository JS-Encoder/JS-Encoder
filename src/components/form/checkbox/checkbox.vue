<script lang="ts" setup>
interface IProps {
  /** 是否选中 */
  modelValue?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  disabled: false,
})

const emits = defineEmits<{
  (event: "update:modelValue", state: boolean): void,
}>()

const namespace = "checkbox"

const handleClickCheckbox = (): void => {
  if (props.disabled) { return }
  emits("update:modelValue", !props.modelValue)
}
</script>

<template>
  <div
    class="font-xs relative flex-y-center fade-ease flex line-h-fill no-select"
    :class="[
      `${namespace}`,
      disabled ? 'disabled cursor-default' : 'active-text cursor-pointer',
      modelValue ? 'checked' : 'describe-text',
    ]"
    @click="handleClickCheckbox">
    <input
      class="absolute"
      type="checkbox"
      :class="[
        `${namespace}-input`,
        disabled ? 'cursor-default' : 'cursor-pointer',
      ]"
      :checked="modelValue">
    <span
      v-show="modelValue"
      class="flex-center absolute"
      :class="`${namespace}-icon`">
      <i class="icon iconfont icon-ok"></i>
    </span>
    <span><slot></slot></span>
  </div>
</template>

<style lang="scss" scoped>
$namespace: checkbox;

.#{$namespace} {
  width: fit-content;
  &::before {
    content: "";
    display: inline-block;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    border: 2px solid var(--color-form-item);
    border-radius: 4px;
    margin-right: 8px;
  }
  &.checked {
    &::before {
      border-color: var(--color-primary1);
      background-color: var(--color-primary1);
    }
  }
  &.disabled {
    color: var(--color-disabled-color);
    &::before {
      border-color: var(--color-form-item);
      background-color: var(--color-form-item);
    }
  }
  .#{$namespace}-input {
    width: 18px;
    height: 18px;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .#{$namespace}-icon {
    width: 18px;
    height: 18px;
  }
}
</style>