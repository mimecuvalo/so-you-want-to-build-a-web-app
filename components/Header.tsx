import { useState } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import { GitHubLogoIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useLocation } from '@tanstack/react-router';
import classNames from 'classnames';
import { PAGES } from 'lib/constants';
import { toggleColorScheme } from 'lib/color-scheme';
import Link from './Link';
import styles from './header.module.css';

// Material's "Lightbulb" glyph, kept from before the move off MUI since Radix has no equivalent.
function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden>
      <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7" />
    </svg>
  );
}

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <header className={styles.header}>
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen} swipeDirection="left">
        <Drawer.Trigger className={styles.iconButton} aria-label="open drawer">
          <HamburgerMenuIcon width={24} height={24} aria-hidden />
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Backdrop className={styles.backdrop} />
          <Drawer.Viewport className={styles.viewport}>
            <Drawer.Popup className={styles.drawer} aria-label="table of contents">
              <Drawer.Content>
                <ol className={styles.nav}>
                  {PAGES.map((page) => {
                    const isCurrent = pathname.slice(1) === page.slug;
                    return (
                      <li key={page.slug} className={classNames({ [styles.current]: isCurrent })}>
                        <Link
                          href={`/${page.slug}`}
                          aria-current={isCurrent ? 'page' : undefined}
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {page.title}
                        </Link>
                      </li>
                    );
                  })}
                </ol>

                <div className={styles.drawerFooter}>
                  <Link href="https://github.com/mimecuvalo/so-you-want-to-build-a-web-app" target="_blank">
                    <GitHubLogoIcon className={styles.github} width={32} height={32} aria-label="GitHub" />
                  </Link>
                  <Link href="https://www.nightlight.rocks" target="_blank">
                    <img className={styles.nightlight} alt="nightlight" src="/favicon.svg" width={29.5} height={29.5} />
                  </Link>
                </div>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>

      {pathname !== '/so-you-want-to-build-a-web-app' && (
        <div className={styles.title}>
          <Link href="/">so, you want to build a web app</Link>
        </div>
      )}

      <button
        type="button"
        className={classNames(styles.iconButton, styles.colorSchemeToggle)}
        aria-label="toggle dark mode"
        onClick={toggleColorScheme}
      >
        <LightbulbIcon />
      </button>
    </header>
  );
}
