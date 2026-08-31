import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import NextLink from 'next/link';

export interface LinkProps extends MuiLinkProps {
  // Pages Router still prefetches on hover when this is false. That's the behavior we want for
  // the nav drawer, whose 18 links would otherwise all prefetch the moment it opens.
  prefetch?: boolean;
}

const Link: React.FC<LinkProps> = ({ children, target, href, prefetch = false, ...props }) => {
  // Only same-site paths navigate client-side. Everything else - external URLs, `#anchor`,
  // mailto: - stays a plain anchor and keeps its existing behavior.
  const isInternal = typeof href === 'string' && href.startsWith('/') && !target;

  if (!isInternal) {
    return (
      <MuiLink
        underline="hover"
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </MuiLink>
    );
  }

  return (
    <MuiLink component={NextLink} underline="hover" href={href} prefetch={prefetch} {...props}>
      {children}
    </MuiLink>
  );
};

export default Link;
