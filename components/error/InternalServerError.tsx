import { Emoji, Message } from 'components/error/error.styles';

import { Typography } from 'components';

export default function InternalServerError() {
  return (
    <Message>
      <Emoji role="img" aria-label="see no evil, hear no evil, speak no evil monkeys">
        🙈 🙉 🙊
      </Emoji>
      <Typography variant="h1">
        <span className="notranslate">500:</span> Internal server error
      </Typography>
      <div>
        It’s not you, it’s us. Our server is monkeying around.
        <br />
        We’ve logged this error and we’ll fix it soon.
      </div>
    </Message>
  );
}
