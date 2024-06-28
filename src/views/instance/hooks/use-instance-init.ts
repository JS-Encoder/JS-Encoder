import useEditorWrapperState from "@hooks/use-editor-wrapper-state"
import useInstanceLink from "@hooks/use-instance-link"
import { useCommonStore } from "@store/common"
import { initialSettings, useEditorConfigStore } from "@store/editor-config"
import { Theme } from "@type/interface"
import { LocalStorageKey } from "@utils/config/storage"
import { getLocalStorage } from "@utils/tools/storage"
import useTemplate from "@views/components/modals/template-modal/hooks/use-template"
import { storeToRefs } from "pinia"
import { onMounted, watch } from "vue"
import { useRoute } from "vue-router"

const useInstanceInit = () => {

  const initTheme = () => {
    const commonStore = useCommonStore()
    const { updateTheme } = commonStore
    const { theme } = storeToRefs(commonStore)
    const instanceTheme = getLocalStorage(LocalStorageKey.THEME) || Theme.DARK
    updateTheme(instanceTheme)
    onMounted(() => {
      watch(theme, (newTheme) => {
        document.documentElement.setAttribute("theme", newTheme)
      }, { immediate: true })
    })
  }

  const initEditorSettings = () => {
    const { updateSettings } = useEditorConfigStore()
    const editorSettings = getLocalStorage(LocalStorageKey.EDITOR_SETTINGS) || initialSettings
    updateSettings(editorSettings)
  }

  /** 初始化部分，如果链接中带有配置信息，则将应用配置，否则使用默认配置 */
  const initWrapper = () => {
    const route = useRoute()
    const { query } = route
    const { applyTemplate } = useTemplate()
    const { getInstanceConfig } = useInstanceLink()
    const instanceConfig = getInstanceConfig(query.config as string)
    if (instanceConfig) {
      applyTemplate(instanceConfig)
    } else {
      const { initDefaultWrapper } = useEditorWrapperState()
      initDefaultWrapper()
    }
  }

  const initInstance = () => {
    initTheme()
    initWrapper()
    initEditorSettings()
  }

  return {
    initInstance,
  }
}

export default useInstanceInit