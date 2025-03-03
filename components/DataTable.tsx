// components/DataTable.tsx
'use client'; // Mark this as a Client Component

import { useEffect } from 'react';
import styles from '../styles/components/DataTable.module.css';

declare global {
  interface Window {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    Tabulator: any;
  }
}

interface DataTableProps {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  data: any[];
}

export default function DataTable({ data }: DataTableProps) {
  useEffect(() => {
    if (data && window.Tabulator) {
      new window.Tabulator("#dataTable", { data, autoColumns: true, layout: "fitColumns" });
    }
  }, [data]);

  return (
    <div id="div3" className={`${styles.rounded} ${styles.dataTable}`}>
      <div id="dataTable"></div>
    </div>
  );
}