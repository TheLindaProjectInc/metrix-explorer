import {i18n} from '@/plugins/i18n'

export default {
  functional: true,
  render(createElement) {
    return [
      createElement('Icon', {props: {icon: 'area-chart'}}),
      'Resources'
    ]
  }
}
