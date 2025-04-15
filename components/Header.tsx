import styles from '../styles/components/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>Resource Load Analytics</h1>
    </header>
  );
}