import {
  InputNumber,
  Tooltip,
  Popover,
  Radio,
  Slider,
  Checkbox,
  Option,
  Select,
  MessageBox,
  Message,
  Dialog,
  Upload,
  Button,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tabs,
  TabPane,
  Notification
} from 'element-ui'
const element = {
  install (Vue) {
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$message = Message
    Vue.prototype.$notify = Notification
    Vue.use(InputNumber)
    Vue.use(Tooltip)
    Vue.use(Popover)
    Vue.use(Radio)
    Vue.use(Slider)
    Vue.use(Checkbox)
    Vue.use(Option)
    Vue.use(Select)
    Vue.use(Dialog)
    Vue.use(Upload)
    Vue.use(Button)
    Vue.use(Input)
    Vue.use(Dropdown)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(Tabs)
    Vue.use(TabPane)
  },
}
export default element