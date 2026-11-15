import styles from './error.module.css';

export default function ErrorScreen() {
  return (
    <div className={styles.message}>
      <span className={styles.emoji} role="img" aria-label="see no evil, hear no evil, speak no evil monkeys">
        🙈 🙉 🙊
      </span>
      <h1>
        <span className="notranslate">500:</span> Internal server error
      </h1>
      <div>It’s not you, it’s us. Our server is monkeying around.</div>
    </div>
  );
}
