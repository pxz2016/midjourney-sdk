import type { AppProps } from 'next/app'
import '../globals.css'
import MjToast from '@/components/mj-toast'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MjToast>
      <Component {...pageProps} />
    </MjToast>
  )
}
