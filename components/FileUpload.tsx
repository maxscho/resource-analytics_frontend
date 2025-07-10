"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../styles/components/FileUpload.module.css";

interface FileUploadProps {
  onUpload: (file: File) => void;
  shouldAutoLoad?: boolean; // Add optional prop to control auto-loading
}

export default function FileUpload({
  onUpload,
  shouldAutoLoad = true,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const hasAutoLoadedRef = useRef(false);

  useEffect(() => {
    const loadSampleFile = async () => {
      try {
        const response = await fetch("/data/PurchasingExamplePseudo.csv");
        const csvText = await response.text();

        const sampleFile = new File([csvText], "PurchasingExamplePseudo.csv", {
          type: "text/csv",
        });

        setFile(sampleFile);
        hasAutoLoadedRef.current = true;

        onUpload(sampleFile);
      } catch (error) {
        console.error("Error loading sample file:", error);
      }
    };

    if (!hasAutoLoadedRef.current && shouldAutoLoad) {
      loadSampleFile();
    }
  }, []);

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div id="uploadEventLogButton" className={`${styles.rounded} ${styles.fileUpload}`}>
      <p>Upload an event log</p>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center">
          <input
            type="file"
            id="fileInput"
            className="d-none"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="fileInput" className="btn btn-primary">
            Choose File
          </label>
          <span className="ms-2">{file ? file.name : "No file chosen"}</span>
        </div>
        <button
          id="fetchButton"
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
