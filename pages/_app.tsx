import dotenv from 'dotenv';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "reflect-metadata"

dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
