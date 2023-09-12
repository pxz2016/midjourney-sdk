import type { AppProps } from 'next/app'
import '../globals.css'
import { MessageProvider } from '@/content/message'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  )
}
