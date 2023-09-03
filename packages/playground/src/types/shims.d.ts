import { MidJourney } from '../../lib'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $mj: MidJourney
  }
}
