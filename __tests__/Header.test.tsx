import { Header } from 'components';
import { PAGES } from 'lib/constants';
import { renderWithRouter, screen } from 'util/testing';
import userEvent from '@testing-library/user-event';

describe('Header', () => {
  it('links home except on the first page', async () => {
    await renderWithRouter(<Header />, { path: '/db' });
    expect(screen.getByRole('link', { name: 'so, you want to build a web app' })).toHaveAttribute('href', '/');
  });

  it('hides the home link on the first page', async () => {
    await renderWithRouter(<Header />, { path: `/${PAGES[0].slug}` });
    expect(screen.queryByRole('link', { name: 'so, you want to build a web app' })).toBeNull();
  });

  it('lists every page in the drawer and marks the current one', async () => {
    await renderWithRouter(<Header />, { path: '/db' });
    await userEvent.click(screen.getByRole('button', { name: 'open drawer' }));

    const drawer = await screen.findByRole('dialog');
    for (const page of PAGES) {
      expect(drawer).toHaveTextContent(page.title);
    }
    expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', '/db');
  });
});
