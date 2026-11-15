import type { AnchorHTMLAttributes, Ref } from 'react';
import { createLink } from '@tanstack/react-router';
import classNames from 'classnames';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: Ref<HTMLAnchorElement> };

function Anchor({ className, ...props }: AnchorProps) {
  return <a className={classNames('link', className)} {...props} />;
}

// The template's plain anchor styling with TanStack Router's client-side navigation and
// intent-preloading.
const RouterLink = createLink(Anchor);

export default function Link({ children, target, href, ...props }: AnchorProps) {
  // Only same-site paths navigate client-side. Everything else - external URLs, `#anchor`,
  // mailto: - stays a plain anchor and keeps its existing behavior.
  const isInternal = typeof href === 'string' && href.startsWith('/') && !target;

  if (!isInternal) {
    return (
      <Anchor href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} {...props}>
        {children}
      </Anchor>
    );
  }

  // The router takes the fragment separately; folding it into `to` would treat it as path.
  const [to, hash] = href.split('#');
  return (
    <RouterLink to={to} hash={hash} {...props}>
      {children}
    </RouterLink>
  );
}
