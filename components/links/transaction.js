import mergeProps from '@/utils/merge-props'
import Clipboard from '../clipboard.vue'
import './style.less'

export default {
  name: 'transaction-link',
  functional: true,
  props: {
    transaction: {type: [Number, String], required: true},
    plain: {type: Boolean, default: false},
    clipboard: {type: [String, Boolean], default: true}
  },
  render(createElement, {data, props, slots}) {
    let children = [
      props.plain
        ? createElement(
          'span',
          {class: ['break-word', 'monospace']},
          slots().default || props.transaction.toString()
        )
        : createElement(
          'nuxt-link',
          {
            class: ['break-word', 'monospace'],
            attrs: {to: {name: 'tx-id', params: {id: props.transaction}}}
          },
          slots().default || props.transaction.toString()
        )
    ]
    if (props.clipboard) {
      children.push(createElement(Clipboard, {attrs: {
        string: (props.clipboard === true ? props.transaction : props.clipboard).toString()
      }}))
    }
    return createElement(
      'span',
      mergeProps(data, {class: 'transaction-link'}),
      children
    )
  }
}
