<template>
  <div
    class="editor-instance fill over-hidden"
    ref="editorRef"
    v-show="tmpShowStatus"
  ></div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue"
import { IEditorViewExpose, IEmits, IProps } from "./editor"
import { EditorView } from "@codemirror/view"
import { EditorState, Extension } from "@codemirror/state"
import { CodemirrorBase } from "@utils/editor/utils/codemirror-base"
import { CodemirrorExtensionsUpdater, ExtensionToggler } from "@utils/editor/utils/codemirror-extensions-updater"
import { ShortcutMode } from "@type/settings"
import { getPrepAutocompleteExtension, getPrepEmmetExtension, getPrepLintExtension } from "@utils/editor/config/editor.config"
import { minimalSetup, basicSetup } from "codemirror"
import { Theme } from "@type/interface"

const props = withDefaults(defineProps<IProps>(), {
  modelValue: "",
  code: "",
  extensions: () => [],
  settings: () => ({
    lineWrapping: true,
    lineNumbers: true,
    indentWithTab: true,
    tabSize: 2,
    shortcutTemplate: ShortcutMode.VSCODE,
    style: {},
    theme: Theme.DARK,
  }),
})
const emits = defineEmits<IEmits>()

const editorRef = shallowRef<HTMLElement | null>(null)
const editorState = shallowRef<EditorState>()
const editorView = shallowRef<EditorView>()
const editorScrollTop = ref<number>(0)

// eslint-disable-next-line max-lines-per-function
onMounted(() => {
  // 初始化编辑器
  editorState.value = EditorState.create({
    doc: props.modelValue || props.code,
    extensions: [
      props.minimal ? minimalSetup : basicSetup,
      EditorView.updateListener.of((update) => {
        // 监听内容改变
        if (update.docChanged) {
          const code = update.state.doc.toString()
          emits("codeChanged", code)
          emits("update:modelValue", code)
        }
        // 焦点改变
        if (update.focusChanged) {
          emits(update.view.hasFocus ? "focus" : "blur")
        }
      }),
      EditorView.domEventHandlers({
        scroll(event: Event){
          if (!event.target) { return }
          editorScrollTop.value = (event.target! as HTMLElement)?.scrollTop
        },
      }),
    ],
  })
  editorView.value = new EditorView({
    state: editorState.value,
    parent: editorRef.value!,
  })

  const baseUtil = new CodemirrorBase(editorView.value)
  const extensionsUpdater = new CodemirrorExtensionsUpdater(editorView.value)
  /**
   * 监听各种编辑器状态设置
   */
  watch(
    () => props.code,
    (newContent) => {
      if (newContent === baseUtil.getContent()) { return }
      baseUtil.setContent(newContent)
    },
  )
  watch(
    () => props.modelValue,
    (newContent) => {
      if (newContent === baseUtil.getContent()) { return }
      baseUtil.setContent(newContent)
    },
  )
  watch(
    () => props.settings.tabSize,
    (newTabSize = 2) => extensionsUpdater.setTabSize(newTabSize),
    { immediate: true },
  )
  watch(
    () => props.settings.indentWithTab,
    (newStatus) => extensionsUpdater.tabIndentToggler(newStatus),
    { immediate: true },
  )
  watch(
    () => props.settings.lineNumbers,
    (newStatus) => extensionsUpdater.lineNumbersToggler(newStatus),
    { immediate: true },
  )
  watch(
    () => props.settings.lineWrapping,
    (newStatus) => extensionsUpdater.lineWrappingToggler(newStatus),
    { immediate: true },
  )
  watch(
    () => props.settings.style,
    (newStyle) => extensionsUpdater.setStyle(newStyle),
    { immediate: true },
  )
  watch(
    () => props.settings.theme,
    (newTheme) => extensionsUpdater.setTheme(newTheme!),
    { immediate: true },
  )
  watch(
    () => props.extensions,
    (newExtensions) => {
      if (!newExtensions) { return }
      extensionsUpdater.extensionUpdater(newExtensions)
    },
    { immediate: true },
  )

  // editor展示时自动获取焦点
  watch(
    () => props.showEditor,
    (newStatus) => {
      if (!newStatus) { return }
      nextTick(() => {
        baseUtil.focus()
      })
    },
    { immediate: true },
  )

  /** 切换emmet */
  let emmetToggler: ExtensionToggler
  /** 切换lint */
  let lintToggler: ExtensionToggler
  /** 切换hint */
  let codeHintToggler: ExtensionToggler
  const switchNewToggler = (toggler: ExtensionToggler, extension: Extension): ExtensionToggler => {
    const oldToggler = toggler
    const newToggler = extensionsUpdater.getExtensionToggler(extension)
    oldToggler?.(false)
    return newToggler
  }
  watch(
    () => props.prep,
    (newPrep) => {
      // 切换prep的同时关闭旧prep相关的插件，同时开启新prep对应的插件
      emmetToggler = switchNewToggler(emmetToggler, getPrepEmmetExtension(newPrep))
      emmetToggler(props.settings.useEmmet)
      lintToggler = switchNewToggler(lintToggler, getPrepLintExtension(newPrep))
      lintToggler(props.settings.codeLint)
      codeHintToggler = switchNewToggler(codeHintToggler, getPrepAutocompleteExtension(newPrep))
    },
    { immediate: true },
  )
  watch(
    () => props.settings.useEmmet,
    (newStatus) => emmetToggler(newStatus),
    { immediate: true },
  )
  watch(
    () => props.settings.codeLint,
    (newStatus) => lintToggler(newStatus),
    { immediate: true },
  )
  // watch(
  //   () => props.settings.codeHinting,
  //   (newStatus) => autocompleteToggler(newStatus),
  //   { immediate: true },
  // )

  onBeforeUnmount(() => {
    editorView.value?.destroy()
  })
})

const tmpShowStatus = ref<boolean>(true)
defineExpose<IEditorViewExpose>({
  getEditorView: () => editorView.value!,
  restoreViewScroll: (delay?: boolean) => {
    if (!editorView.value) { return }
    const scrollDOM = editorView.value.scrollDOM
    // 恢复scrollTop
    // TODO: 有时设置scrollTop会失效，如果setTimeout延迟100会解决，但要检查原因
    const scrollToBefore = () => {
      scrollDOM.scrollTop = editorScrollTop.value
      editorView.value!.focus()
    }
    if (delay) {
      nextTick(scrollToBefore)
    } else {
      scrollToBefore()
    }
  },
})
</script>

<style lang="scss" scoped></style>