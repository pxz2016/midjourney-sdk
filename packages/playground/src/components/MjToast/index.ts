import { Plugin, createVNode, render } from 'vue'
import Toast from './index.vue'

export const toastTypes = {
  success: {
    class: 'border-green-500 bg-green-500',
    icon: 'access'
  },
  error: {
    class: 'border-red-500 bg-red-500',
    icon: 'exclamation'
  },
  warning: {
    class: 'border-orange-500 bg-orange-500',
    icon: 'warning'
  }
}

export interface IToastProps {
  msg: string
  type: keyof typeof toastTypes
  duration: number
  onDestory?: () => void
}

export const handleToast = ({
  msg,
  type = 'success',
  duration = 1500
}: IToastProps) => {
  const div = document.createElement('div')
  const vnode = createVNode(Toast, {
    msg,
    type,
    duration,
    onDestory: () => {
      render(null, div)
    }
  })
  render(vnode, div)
  document.body.appendChild(div.firstElementChild!)
}

export default {
  install(app) {
    app.config.globalProperties.$toast = handleToast
  }
} as Plugin
