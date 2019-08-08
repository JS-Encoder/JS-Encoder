/* eslint-disable */
import { Button, Select, Option, Input, InputNumber, Checkbox, CheckboxGroup, CheckboxButton, RadioGroup, RadioButton, Collapse, CollapseItem } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Button)
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
  }
}

export default element