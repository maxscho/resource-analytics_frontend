"use client";

import styles from "../styles/components/DataTable.module.css";

interface DataTableProps {
  data: { [key: string]: any }[];
}

export default function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className={`${styles.rounded} ${styles.dataTable}`}>
      <table>
        <thead>
          <tr style={{ backgroundColor: "darkgrey" }}>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                backgroundColor: rowIndex % 2 === 0 ? "white" : "lightgrey",
              }}
            >
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
