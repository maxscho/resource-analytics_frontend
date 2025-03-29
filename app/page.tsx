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
import InfoPanel from "@/components/InfoPanel";
import { AnalysisData } from "../models/AnalysisData";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [metaData, setMetaData] = useState<MetaEventData[]>([]); // meta-information of the uploaded event log
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("");
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
  const [showFilterSelector, setShowFilterSelector] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [initialHeaders, setInitialHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<{
    metrics: { label: string; value: string }[];
    resources: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    activities: { label: string; value: string }[];
  }>({
    metrics: [],
    resources: [],
    roles: [],
    activities: [],
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/tabulator-tables@5.5.4/dist/js/tabulator.min.js";
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
      console.log("Upload Response:", data);
      setImageSrc(`data:image/jpeg;base64,${data.image}`);
      setMetaData(data.table);
      setDropdownOptions({
        metrics: ([]).map((item: string) => ({
          label: item,
          value: item,
        })),
        resources: (data.resource || []).map((item: string) => ({
          label: item,
          value: item,
        })),
        roles: (data.role || []).map((item: string) => ({
          label: item,
          value: item,
        })),
        activities: (data.activity || []).map((item: string) => ({
          label: item,
          value: item,
        })),
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
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

      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <FileUpload onUpload={handleUpload} />
          <ImageViewer imageSrc={imageSrc} />
          <DataTable data={metaData} />
        </div>
        <div className={`${ styles.rounded} ${styles.rightPanel}`}>
          <AnalysisDropdown
            selectedAnalysis={selectedAnalysis}
            setSelectedAnalysis={setSelectedAnalysis}
            setData={setData}
            setInitialHeaders={setInitialHeaders}
            setSelectedHeaders={setSelectedHeaders}
            dropdownOptions={dropdownOptions}
          />
          <InfoPanel 
            selectedAnalysis={selectedAnalysis}
          />
          <AnalysisDropdownContent
            selectedAnalysis={selectedAnalysis}
            setIsLoading={setIsLoading}
            showFilterSelector={showFilterSelector}
            setShowFilterSelector={setShowFilterSelector}
            showColumnSelector={showColumnSelector}
            setShowColumnSelector={setShowColumnSelector}
            data={data}
            setData={setData}
            initialHeaders={initialHeaders}
            setInitialHeaders={setInitialHeaders}
            selectedHeaders={selectedHeaders}
            setSelectedHeaders={setSelectedHeaders}
          />
        </div>
      </div>

      {isLoading && <Loader />}
    </>
  );
}
