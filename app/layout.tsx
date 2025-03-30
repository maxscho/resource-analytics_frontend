// app/(main)/layout.tsx
import Header from "../components/Header";
import styles from "../styles/components/Home.module.css";
import { ReactNode } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <html>
      <body>
        <Header />
        <div className={styles.container}>{children}</div>
      </body>
    </html>
  );
}
