import { Emoji, Message } from 'components/error/error.styles';
import { Link, Typography } from 'components';

export default function NotFound() {
  return (
    <Message>
      <Emoji role="img" aria-label="upside down face">
        🙃
      </Emoji>
      <Typography variant="h1">
        <span className="notranslate">404:</span> Not found
      </Typography>
      <div>
        I'm sorry, dave. I'm afraid I can't do that.
        <br />
        Try going back to the <Link href="/">beginning</Link>.
      </div>
    </Message>
  );
}
