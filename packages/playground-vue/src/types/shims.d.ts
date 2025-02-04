import { MidJourney } from 'midjourney-sdk'
import { handleToast } from '@/components/MjToast'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $mj: MidJourney
    $toast: typeof handleToast
  }
}
