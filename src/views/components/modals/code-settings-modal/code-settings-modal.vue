<template>
  <modal
    title="编码设置"
    width="730"
    top="85"
    bottom="85"
    show-cancel
    @close="updateDisplayModal(null)">
    <div class="flex">
      <div class="flex-col flex-1">
        <div class="modal-sub-title">编码</div>
        <!-- 暂时不能切换智能提示，直接打开 -->
        <!-- <div class="mt-s"><checkbox v-model="settings.edit.codeHinting">智能提示</checkbox></div> -->
        <div class="mt-s"><checkbox v-model="settings.edit.codeLint">lint检查</checkbox></div>
        <div class="mt-s"><checkbox v-model="settings.edit.lineWrapping">自动换行</checkbox></div>
        <div class="mt-s"><checkbox v-model="settings.edit.useEmmet">使用Emmet</checkbox></div>

        <div class="modal-sub-title">缩进</div>
        <div class="pt-xs"><checkbox v-model="settings.indent.indentWithTab">使用制表符缩进</checkbox></div>
        <div class="active-text font-xxs mt-m">缩进长度</div>
        <div class="mt-s">
          <custom-input
            :type="InputType.NUMBER"
            :min="0"
            :max="8"
            v-model="settings.indent.tabSize"
          ></custom-input>
        </div>

        <div class="modal-sub-title">执行</div>
        <div class="pt-xs"><checkbox v-model="settings.execute.autoExecute">自动执行</checkbox></div>
        <!-- 暂时不需要这个选项 -->
        <!-- <div
          class="font-xxs mt-m"
          :class="settings.execute.autoExecute ? 'active-text' : 'no-active-text'"
        >延迟(执行)时间(ms):</div> -->
        <!-- <div class="mt-s">
          <custom-input :type="InputType.NUMBER" v-model="settings.execute.delayTimeOfExecute"/>
        </div> -->
      </div>
      <div class="flex-col flex-1">
        <div class="modal-sub-title">字体</div>
        <div class="active-text font-xxs mt-m">字号(px)</div>
        <div class="mt-s"><custom-input :type="InputType.NUMBER" v-model="settings.font.fontSize"/></div>
        <div class="active-text font-xxs mt-m">字体</div>
        <div class="mt-s">
          <custom-select
            appendToBody
            v-model="settings.font.fontFamily"
            :data-list="codeFontFamilyOptions"
          ></custom-select>
        </div>

        <div class="modal-sub-title">其他</div>
        <div class="active-text font-xxs mt-m">头部标签</div>
        <div class="mt-s">
          <custom-input
            placeholder="输入你想在<head>中添加的标签如<meta...>"
            width="325px"
            v-model="settings.other.headTags"
            :type="InputType.TEXTAREA"
            :minRows="4"
          ></custom-input>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex pt-l">
        <custom-button @click="handleResetSettings">恢复默认设置</custom-button>
        <div class="flex-1"></div>
        <custom-button class="mr-s" @click="updateDisplayModal(null)">取消</custom-button>
        <custom-button :type="BtnType.PRIMARY" @click="handleConfirm">确认</custom-button>
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import Modal from "@components/modal/modal.vue"
import Checkbox from "@components/form/checkbox/checkbox.vue"
import CustomInput from "@components/form/custom-input/custom-input.vue"
import CustomSelect from "@components/form/custom-select/custom-select.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import { ref } from "vue"
import { useCommonStore } from "@store/common"
import { InputType } from "@components/form/custom-input/custom-input"
import { initialSettings, useEditorConfigStore } from "@store/editor-config"
import { deepCopy } from "@utils/tools/common"
import { CodeFontFamily, IEditorSettings } from "@type/settings"
import { BtnType } from "@type/interface"

const commonStore = useCommonStore()
const { updateDisplayModal } = commonStore

const editorConfigStore = useEditorConfigStore()
const { updateSettings } = editorConfigStore

/** 复制store中的设置下来 */
const settings = ref<IEditorSettings>(deepCopy(editorConfigStore.settings))

const codeFontFamilyOptions = Object.values(CodeFontFamily).map((codeFontFamily) => {
  return { value: codeFontFamily }
})

const handleResetSettings = () => {
  updateSettings(initialSettings)
  settings.value = deepCopy(initialSettings)
}

const handleConfirm = () => {
  updateSettings(settings.value)
  updateDisplayModal(null)
}
</script>

<style lang="scss" scoped></style>