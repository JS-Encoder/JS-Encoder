<template>
  <div
    class="template active-text flex code-font p-l radius-l cursor-pointer fade-ease relative"
    :class="active ? 'active' : ''"
    @click="emits('choose', template)">
    <svg class="lang-icon flex-sh" aria-hidden="true">
      <use :xlink:href="`#${templateIcon}`"></use>
    </svg>
    <div class="flex-col flex-jcb">
      <div class="font-xs template-lang line-clamp1">{{template.name || template.lang}}</div>
      <div
        class="font-xxs template-type"
        :class="template.isComponent ? 'golden-text' : 'describe-text'"
      >{{template.isComponent ? "component" : "default"}}</div>
      <i
        v-show="template.type === TemplateType.CUSTOM && active"
        class="icon iconfont icon-edit-template absolute pos-bottom pos-right mr-s mb-s"
        title="编辑模板"
        @click.stop="emits('edit', template)"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TemplateType } from "@type/template"
import { IEmits, IProps, getTemplateIcon } from "./template-card"

const props = withDefaults(defineProps<IProps>(), {})
const emits = defineEmits<IEmits>()

const templateIcon = getTemplateIcon(props.template)
</script>

<style lang="scss" scoped>
.template {
  background-color: var(--color-main-bg-1);
  border: 2px solid var(--color-main-bg-1);
  &:hover {
    border: 2px solid var(--color-primary1);
  }
  &.active {
    background-color: var(--color-primary1);
    border: 2px solid var(--color-primary2);
    color: var(--color-deep-bg-color);
  }
  .lang-icon {
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }
  .template-lang {
    line-height: 18px;
  }
  .template-type {
    line-height: 16px;
  }
}
</style>