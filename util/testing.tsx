import '@testing-library/jest-dom';
import React, { FC, PropsWithChildren, ReactElement } from 'react';
import { RenderOptions, render } from '@testing-library/react';

import { IntlProvider } from 'i18n';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from 'styles';

const AllTheProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      {/* @ts-ignore looks like IntlProvider still needs updated types after React 18 transition. */}
      <IntlProvider defaultLocale="en" locale="en" messages={{}}>
        {/* @ts-ignore looks like IntlProvider still needs updated types after React 18 transition. */}
        {children}
      </IntlProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
