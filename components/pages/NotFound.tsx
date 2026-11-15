import Link from 'components/Link';
import styles from './error.module.css';

export default function NotFound() {
  return (
    <div className={styles.message}>
      <span className={styles.emoji} role="img" aria-label="upside down face">
        🙃
      </span>
      <h1>
        <span className="notranslate">404:</span> Not found
      </h1>
      <div>
        I’m sorry, dave. I’m afraid I can’t do that.
        <br />
        Try going back to the <Link href="/">beginning</Link>.
      </div>
    </div>
  );
}
