import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { createLink } from '@tanstack/react-router';

// MUI's anchor styling with TanStack Router's client-side navigation and intent-preloading.
const RouterLink = createLink(MuiLink);

const Link: React.FC<MuiLinkProps> = ({ children, target, href, ...props }) => {
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

  // The router takes the fragment separately; folding it into `to` would treat it as path.
  const [to, hash] = href.split('#');
  return (
    <RouterLink underline="hover" to={to} hash={hash} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
