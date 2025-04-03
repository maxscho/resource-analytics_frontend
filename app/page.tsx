"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ImageViewer from "../components/ImageViewer";
import DataTable from "../components/DataTable";
import AnalysisDropdown from "../components/AnalysisDropdown";
import Loader from "../components/Loader";
import styles from "../styles/components/pages.module.css";
import Head from "next/head";
import AnalysisDropdownContent from "@/components/AnalysisDropdownContent";
import InfoPanel from "@/components/InfoPanel";
import { AnalysisData } from "../models/AnalysisData";
import AnalysisPanel from "../components/AnalysisPanel";

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
  const [showProcessOverview, setShowProcessOverview] = useState(true);
  const [analysisInstances, setAnalysisInstances] = useState(["Analysis 1"]);

  const addAnalysisInstance = () => {
    setAnalysisInstances([
      ...analysisInstances,
      `Analysis ${analysisInstances.length + 1}`,
    ]);
  };

  const removeAnalysisInstance = (index: number) => {
    setAnalysisInstances(analysisInstances.filter((_, i) => i !== index));
  };

  const gridTemplate = showProcessOverview
    ? `470px repeat(${analysisInstances.length}, 1fr)`
    : `repeat(${analysisInstances.length}, 1fr)`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const plotlyScript = document.createElement("script");
      plotlyScript.src = "https://cdn.plot.ly/plotly-2.27.0.min.js";
      plotlyScript.async = true;
      plotlyScript.onload = () => {
        console.log("Plotly script loaded");
      };
      document.body.appendChild(plotlyScript);

      return () => {
        document.body.removeChild(plotlyScript);
      };
    }
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
        metrics: [].map((item: string) => ({
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </Head>
      
      <div className={styles.placeholder}>
        <div className={styles.layoutNavigation}>
          <button
            onClick={() => setShowProcessOverview(!showProcessOverview)}
            className={`btn btn-primary btn-sm`}>
            {showProcessOverview ? "Hide" : "Show"} Process Overview
          </button>
          <div className={styles.alignRight}>
            <button
              onClick={addAnalysisInstance}
              className={`btn btn-success btn-sm ${styles.buttonElement}`}
              >
                Add Analysis Panel
            </button>
            {analysisInstances.length > 1 && (
              <button
                onClick={() => removeAnalysisInstance(analysisInstances.length - 1)}
                className={`btn btn-danger btn-sm `}
                >
                Remove Analysis Panel
              </button>
            )}
          </div>
        </div>

        <div className={styles.container}>
          {showProcessOverview && (
          <div className={styles.leftPanel}>
            <FileUpload onUpload={handleUpload} />
            <ImageViewer imageSrc={imageSrc} />
            <DataTable data={metaData} />
          </div>)}
          <div 
            className={styles.rightPanel}
            style={{width: showProcessOverview ? "70%" : "100%"}}
          >
            {analysisInstances.map((_, index) => (
                <div
                key={index}
                className={styles.rightPanelElement}
                style={{
                  maxWidth: analysisInstances.length > 1 ? "850px" : "none",
                }}
                >
                <AnalysisPanel dropdownOptions={dropdownOptions} />
                </div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <Loader />}
    </>
  );
}
