import type { AppProps } from 'next/app'
import '../globals.css'
import { MessageProvider } from '@/content/message'
import { StyleProvider } from '@ant-design/cssinjs'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyleProvider hashPriority="high">
      <MessageProvider>
        <Component {...pageProps} />
      </MessageProvider>
    </StyleProvider>
  )
}
