/* eslint-disable */
import { Button, Backtop, Tag, Slider, Dialog, Notification, Select, Dropdown, Pagination, DropdownMenu, DropdownItem, Tabs, TabPane, Option, Input, InputNumber, Checkbox, CheckboxGroup, CheckboxButton, RadioGroup, RadioButton, Collapse, CollapseItem, Message } from 'element-ui'
const element = {
  install (Vue) {
    Vue.use(Button)
    Vue.use(Backtop)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Dropdown)
    Vue.use(Tag)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(CheckboxGroup)
    Vue.use(CheckboxButton)
    Vue.use(RadioGroup)
    Vue.use(Dialog)
    Vue.use(RadioButton)
    Vue.use(Collapse)
    Vue.use(Slider)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Input)
    Vue.use(InputNumber)
    Vue.use(Checkbox)
    Vue.use(CollapseItem)
    Vue.use(Pagination)
    Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message
  }
}

export default element