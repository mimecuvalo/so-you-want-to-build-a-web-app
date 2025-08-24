import { AppBar, Toolbar, IconButton, Drawer, useTheme, Grid } from '@mui/material';
import { GitHub, Lightbulb, Menu } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { PAGES } from '@/application/constants';
import Link from './Link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ThemeModeContext from '@/application/ThemeModeContext';

export default function Header() {
  const { setIsDarkModeExplicitlyOn } = useContext(ThemeModeContext);
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <header>
      <AppBar position="fixed" sx={{ background: 'none', boxShadow: 'none' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            pr: 0,
            background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
          }}
        >
          <IconButton
            aria-label="open drawer"
            onClick={() => setIsDrawerOpen(true)}
            edge="start"
            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
          >
            <Menu />
          </IconButton>

          <IconButton
            aria-label="toggle dark mode"
            onClick={() => setIsDarkModeExplicitlyOn(theme.palette.mode !== 'dark')}
            edge="start"
            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', transform: 'rotate(180deg)' }}
          >
            <Lightbulb />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { py: 4, background: theme.palette.mode === 'dark' ? '#000' : '#fff' } }}
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
    </header>
  );
}
