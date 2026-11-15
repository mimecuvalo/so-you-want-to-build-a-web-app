import { Menu } from '@base-ui/react/menu';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import styles from './dev.module.css';

// Toggles the react-scan render-highlight overlay (dev perf debugging).
function toggleReactScan() {
  const existing = document.getElementById('react-scan');
  if (existing) {
    existing.remove();
    return;
  }
  const script = document.createElement('script');
  script.id = 'react-scan';
  script.crossOrigin = 'anonymous';
  script.src = 'https://unpkg.com/react-scan/dist/auto.global.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

export default function Help() {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.iconButton} aria-label="Help">
        <QuestionMarkCircledIcon width={24} height={24} aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} side="top" align="end">
          <Menu.Popup className={styles.menuPopup}>
            <Menu.Item className={styles.menuItem} onClick={toggleReactScan}>
              React Scan
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
