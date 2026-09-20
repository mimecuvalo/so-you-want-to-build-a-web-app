import 'styles/globals.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { Container, Header } from 'components';
import { createEmotionCache, createTheme } from 'styles';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import { Inter, Press_Start_2P, Noto_Color_Emoji } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoColorEmoji = Noto_Color_Emoji({ subsets: ['emoji'], weight: '400', variable: '--noto-color-emoji' });

// If loading a variable font, you don't need to specify the font weight
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'block',
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// The theme is scheme-agnostic (both palettes ship as CSS variables), so it never depends on
// render-time state and can be created once for the lifetime of the module.
const muiTheme = createTheme();

export interface CustomAppProps extends AppProps {
  emotionCache: EmotionCache;
  nonce: string;
}

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: CustomAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      {/* defaultMode="system" follows prefers-color-scheme until the user picks a mode, which
          MUI then persists to localStorage and InitColorSchemeScript replays before first paint. */}
      <ThemeProvider theme={muiTheme} defaultMode="system">
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <style jsx global>{`
          :root {
            --font-press-start-2p: ${pressStart2P.style.fontFamily};
            --font-noto-color-emoji: ${notoColorEmoji.style.fontFamily};
          }
        `}</style>
        <div
          className={classNames({
            'App-logged-in': true,
            'App-is-development': process.env.NODE_ENV === 'development',
            [pressStart2P.variable]: true,
            [inter.variable]: true,
            [notoColorEmoji.variable]: true,
          })}
        >
          <Header />
          <Head>
            <meta name="viewport" content="minimum-scale=1, width=device-width" />
          </Head>
          <Container sx={{ my: 8, width: { xs: '100%', sm: 'clamp(45ch, 80%, 75ch)' } }}>
            <Component {...pageProps} />
          </Container>
          <Analytics />
        </div>

        <noscript>You need to enable JavaScript to run this app.</noscript>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
