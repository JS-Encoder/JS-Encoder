/* eslint-disable */
import { Button, Select, Dropdown, DropdownMenu, DropdownItem, Tabs, TabPane, Option, Input, InputNumber, Checkbox, CheckboxGroup, CheckboxButton, RadioGroup, RadioButton, Collapse, CollapseItem, Message } from 'element-ui'
const element = {
  install(Vue) {
    Vue.use(Button)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Dropdown)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(CheckboxGroup)
    Vue.use(CheckboxButton)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)
    Vue.use(Collapse)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Input)
    Vue.use(InputNumber)
    Vue.use(Checkbox)
    Vue.use(CollapseItem)
    Vue.prototype.$message = Message
  }
}

export default element