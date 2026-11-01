import { Suspense, lazy, memo, useSyncExternalStore } from 'react';

import Help from './Help';
import { styled } from '@mui/material/styles';

const Debug = lazy(() => import('components/internal/Debug'));

const StyledDebugWrapper = styled('div')`
  position: fixed;
  bottom: ${(props) => props.theme.spacing(1)};
  right: ${(props) => props.theme.spacing(2.5)}; // Swipeable drawer width.

  & button {
    margin-left: ${(props) => props.theme.spacing(1)};
  }
`;

// NB: we memoize here because it has the a11y script included on dev which is expensive.
const DebugWrapper = memo(function DebugWrapper() {
  // False during SSR and hydration, true afterwards on the client.
  const isLoaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <StyledDebugWrapper>
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <Suspense fallback={<span />}>
          <Debug />
        </Suspense>
      )}
      <Help />
    </StyledDebugWrapper>
  );
});
export default DebugWrapper;
