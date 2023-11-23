import 'styles/globals.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { Container, Header } from 'components';
import { IntlProvider, setupCreateIntl } from 'i18n';
import { createEmotionCache, createTheme } from 'styles';
import { disposeAnalytics, setupAnalytics } from 'app/analytics';

import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { F } from 'i18n';
import Head from 'next/head';
import { Inter, Press_Start_2P, Noto_Color_Emoji } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import clientHealthCheck from 'app/clientHealthCheck';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { trackWebVitals } from 'app/reportWebVitals';
import { useReportWebVitals } from 'next/web-vitals';
import ThemeModeContext from 'app/ThemeModeContext';

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

export interface CustomAppProps extends AppProps {
  emotionCache: EmotionCache;
  nonce: string;
}

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: CustomAppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkModeExplicitlyOn, setIsDarkModeExplicitlyOn] = useState<boolean | undefined>();
  const { locale = 'en', defaultLocale = 'en' } = useRouter();
  useReportWebVitals(trackWebVitals);

  const muiTheme = useMemo(
    () =>
      createTheme(
        isDarkModeExplicitlyOn !== undefined
          ? isDarkModeExplicitlyOn
            ? 'dark'
            : 'light'
          : prefersDarkMode
          ? 'dark'
          : 'light'
      ),
    [prefersDarkMode, isDarkModeExplicitlyOn]
  );

  useEffect(() => {
    // Upon starting the app, kick off a client health check which runs periodically.
    clientHealthCheck();

    setupAnalytics();

    // TODO(mime)
    // window.configuration = {
    //   experiments: getExperiments(user),
    // };
    // initializeLocalState(window.configuration.experiments);

    return () => {
      disposeAnalytics();
    };
  });

  const messages = pageProps.intlMessages || {};
  // createIntl is used in non-React locations.
  setupCreateIntl({ defaultLocale, locale, messages });

  return (
    // @ts-ignore looks like IntlProvider still needs updated types after React 18 transition.
    <IntlProvider defaultLocale={locale} locale={locale} messages={messages}>
      <CacheProvider value={emotionCache}>
        <ThemeModeContext.Provider value={{ setIsDarkModeExplicitlyOn }}>
          <ThemeProvider theme={muiTheme}>
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
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
              </Head>
              <Container sx={{ my: 8, width: { xs: '100%', sm: 'clamp(45ch, 80%, 75ch)' } }}>
                <Component {...pageProps} />
              </Container>
              <Analytics />
            </div>

            <noscript>
              <F defaultMessage="You need to enable JavaScript to run this app." />
            </noscript>
          </ThemeProvider>
        </ThemeModeContext.Provider>
      </CacheProvider>
    </IntlProvider>
  );
}

export default MyApp;
