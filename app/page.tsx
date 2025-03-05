// app/(main)/page.tsx
"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ImageViewer from "../components/ImageViewer";
import DataTable from "../components/DataTable";
import AnalysisDropdown from "../components/AnalysisDropdown";
import Loader from "../components/Loader";
import styles from "../styles/components/Home.module.css";
import Head from "next/head";
import AnalysisDropdownContent from "@/components/AnalysisDropdownContent";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/tabulator-tables@5.5.4/dist/js/tabulator.min.js";
    script.async = true;
    script.onload = () => {
      console.log("Tabulator script loaded");
    };
    document.body.appendChild(script);

    const plotlyScript = document.createElement("script");
    plotlyScript.src = "https://cdn.plot.ly/plotly-2.27.0.min.js";
    plotlyScript.async = true;
    plotlyScript.onload = () => {
      console.log("Plotly script loaded");
    };
    document.body.appendChild(plotlyScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(plotlyScript);
    };
  }, []);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:9090/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      setImageSrc(`data:image/jpeg;base64,${data.image}`);
      setTableData(data.table);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisChange = async (analysis: string) => {
  };

  return (
    <>
      <Head>
        <title>Resource Load Analytics</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/tabulator-tables@5.5.4/dist/css/tabulator.min.css"
        />
      </Head>

      <div className={styles.leftPanel}>
        <FileUpload onUpload={handleUpload} />
        <ImageViewer imageSrc={imageSrc} />
        <DataTable data={tableData} />
      </div>
      <div id="div4" className={styles.rounded}>
        <AnalysisDropdown 
          selectedAnalysis={selectedAnalysis}
          setSelectedAnalysis={setSelectedAnalysis} 
        />
        <AnalysisDropdownContent 
          selectedAnalysis={selectedAnalysis} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
        />
        <div id="resultContainer">
          {/* Results will be dynamically inserted here */}
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
