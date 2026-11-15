import { Link } from 'components';
import { renderWithRouter, screen } from 'util/testing';

describe('Link', () => {
  it('opens external links in a new tab safely', async () => {
    await renderWithRouter(
      <Link href="https://example.com" target="_blank">
        external
      </Link>
    );

    const link = screen.getByRole('link', { name: 'external' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('link');
  });

  it('routes internal links, keeping the #fragment separate from the path', async () => {
    await renderWithRouter(<Link href="/db#tl-dr">internal</Link>);

    expect(screen.getByRole('link', { name: 'internal' })).toHaveAttribute('href', '/db#tl-dr');
  });

  it('navigates client-side', async () => {
    const { router } = await renderWithRouter(<Link href="/db">go</Link>);

    screen.getByRole('link', { name: 'go' }).click();
    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/db'));
  });
});
