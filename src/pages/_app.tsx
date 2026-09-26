import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function ZhonnexApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
