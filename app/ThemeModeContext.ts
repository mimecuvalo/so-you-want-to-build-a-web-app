import { createContext } from 'react';

interface ContextState {
  setIsDarkModeExplicitlyOn: (mode: boolean | undefined) => void;
}
export default createContext({} as ContextState);
