import { Suspense, lazy, memo, useSyncExternalStore } from 'react';
import Help from './Help';
import styles from './dev.module.css';

// The a11y audit is expensive, so the Debug tray is dev-only and lazy-loaded.
const Debug = lazy(() => import('./Debug'));

const subscribe = () => () => {};

const DebugWrapper = memo(function DebugWrapper() {
  // False during SSR and hydration, true afterwards on the client.
  const isLoaded = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isLoaded || !import.meta.env.DEV) return null;

  return (
    <div className={styles.wrapper}>
      <Suspense fallback={<span />}>
        <Debug />
      </Suspense>
      <Help />
    </div>
  );
});

export default DebugWrapper;
