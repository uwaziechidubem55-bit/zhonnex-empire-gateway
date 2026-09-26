import type { AppProps } from 'next/app';
import Head from 'next/head';

/**
 * ZHONNEX global shell.
 *
 * The global styles are INLINED here (styled-jsx) instead of being imported
 * from a separate CSS file, so the build can never fail because of a
 * missing / not-yet-uploaded file. This fixes the mobile "white gutter":
 * the root document itself is void black on every page.
 */
export default function ZhonnexApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background-color: #000000;
          color: #ffffff;
          color-scheme: dark;
          min-height: 100%;
        }

        body {
          overflow-x: hidden;
          -webkit-text-size-adjust: 100%;
        }

        #__next {
          min-height: 100vh;
          background-color: #000000;
        }

        img {
          max-width: 100%;
        }

        ::selection {
          background: #00f0ff;
          color: #000000;
        }
      `}</style>

      <Component {...pageProps} />
    </>
  );
}
