import { AppBar, Toolbar, IconButton, Drawer, useTheme, Grid, Typography } from '@mui/material';
import { GitHub, Lightbulb, Menu } from '@mui/icons-material';
import { useState } from 'react';
import { PAGES } from '@/application/constants';
import Link from './Link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useColorScheme } from '@mui/material/styles';

export default function Header() {
  const theme = useTheme();
  const { mode, systemMode, setMode } = useColorScheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  // N.B. Resolved only inside the click handler: `mode`/`systemMode` are undefined during SSR and
  // on the first client render, so branching on them while rendering would flash or mismatch.
  const toggleColorScheme = () => setMode((mode === 'system' ? systemMode : mode) === 'dark' ? 'light' : 'dark');

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'none !important', boxShadow: 'none' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            pr: 0,
            // background.paper is already #fff in light and the paper grey in dark.
            background: 'var(--background)',
          }}
        >
          <IconButton
            aria-label="open drawer"
            onClick={() => setIsDrawerOpen(true)}
            edge="start"
            sx={(theme) => ({ color: '#000', ...theme.applyStyles('dark', { color: '#fff' }) })}
          >
            <Menu />
          </IconButton>

          {router.asPath !== '/so-you-want-to-build-a-web-app' && (
            <Typography variant="h4" component="div">
              <Link href="/">so, you want to build a web app</Link>
            </Typography>
          )}

          <IconButton
            aria-label="toggle dark mode"
            onClick={toggleColorScheme}
            edge="start"
            sx={(theme) => ({
              color: '#000',
              transform: 'rotate(180deg)',
              ...theme.applyStyles('dark', { color: '#fff' }),
            })}
          >
            <Lightbulb />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: (theme) => ({ py: 4, background: '#fff', ...theme.applyStyles('dark', { background: '#000' }) }),
        }}
      >
        <ol>
          {PAGES.map((page) => (
            <li
              key={page.slug}
              style={{
                padding: '8px 16px',
                backgroundColor: router.asPath.slice(1) === page.slug ? theme.palette.primary.light : ' ',
              }}
            >
              <Link
                href={`/${page.slug}`}
                sx={{ display: 'block', fontWeight: router.asPath.slice(1) === page.slug ? 'bold' : 'normal' }}
                onClick={() => setIsDrawerOpen(false)}
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ol>

        <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
          <Link href="https://github.com/mimecuvalo/so-you-want-to-build-a-web-app" target="_blank" sx={{ mr: 2 }}>
            <GitHub sx={{ color: '#000', width: 32, height: 32 }} />
          </Link>
          <Link href="https://www.nightlight.rocks" target="_blank">
            <Image alt="nightlight" src="/favicon.svg" width={29.5} height={29.5} style={{ borderRadius: '50%' }} />
          </Link>
        </Grid>
      </Drawer>
    </>
  );
}
