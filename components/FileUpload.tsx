// components/FileUpload.tsx
'use client'; // Mark this as a Client Component

import { useState } from 'react';
import styles from '../styles/components/FileUpload.module.css';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div id="div1" className={`${styles.rounded} ${styles.fileUpload}`}>
      <p>Upload an event log</p>
      <input type="file" id="fileInput" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button id="fetchButton" onClick={handleUpload}>Upload</button>
    </div>
  );
}