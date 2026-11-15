import NotFound from 'components/pages/NotFound';
import { renderWithRouter, screen } from 'util/testing';

describe('NotFound', () => {
  it('explains and links back to the beginning', async () => {
    await renderWithRouter(<NotFound />, { path: '/nope' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404: Not found');
    expect(screen.getByRole('link', { name: 'beginning' })).toHaveAttribute('href', '/');
  });
});
