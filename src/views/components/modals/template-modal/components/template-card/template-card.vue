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
    </div>
    <div
      v-if="template.type === TemplateType.CUSTOM"
      class="absolute pos-right pos-bottom mr-s mb-s"
      title="模板选项">
      <dropdown
        v-model="showMenu"
        position="top"
        align="right"
        append-to-body
        show-triangle
        :level="1002">
        <icon-btn
          size="md"
          icon-class="icon-more"
          title="模板选项"
          hoverBg="none"
          customClass="p-y-m"
        ></icon-btn>
        <template #options>
          <dropdown-item
            v-for="item in templateOptions"
            :key="item.type"
            @click="emits(item.event, template)">
            <div class="p-x-m">{{ item.text }}</div>
          </dropdown-item>
        </template>
      </dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TemplateType } from "@type/template"
import { IEmits, IProps, getTemplateIcon, templateOptions } from "./template-card"
import Dropdown from "@components/dropdown/dropdown.vue"
import DropdownItem from "@components/dropdown/dropdown-item.vue"
import IconBtn from "@components/icon-btn/icon-btn.vue"
import { ref } from "vue"

const props = withDefaults(defineProps<IProps>(), {})
const emits = defineEmits<IEmits>()

const showMenu = ref<boolean>(false)
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