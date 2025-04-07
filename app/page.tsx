"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ImageViewer from "../components/ImageViewer";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import styles from "../styles/components/pages.module.css";
import Head from "next/head";
import { AnalysisData } from "../models/AnalysisData";
import AnalysisPanel from "../components/AnalysisPanel";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [metaData, setMetaData] = useState<MetaEventData[]>([]); // meta-information of the uploaded event log
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [analysisInstances, setAnalysisInstances] = useState<string[]>([
    uuidv4(),
  ]);

  const addAnalysisInstance = () => {
    const panelId = uuidv4();
    fetch(`http://localhost:9090/add_panel?panel_id=${panelId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add panel");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Add Panel Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setAnalysisInstances([...analysisInstances, panelId]);
  };

  const removeAnalysisInstance = (index: number) => {
    setAnalysisInstances(analysisInstances.filter((_, i) => i !== index));
  };

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
      const response = await fetch(`http://localhost:9090/upload?panel_id=${analysisInstances[0]}`, {
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
            className={`btn btn-primary btn-sm`}
          >
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
                onClick={() =>
                  removeAnalysisInstance(analysisInstances.length - 1)
                }
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
            </div>
          )}
          <div
            className={styles.rightPanel}
            style={{ width: showProcessOverview ? "70%" : "100%" }}
          >
            {analysisInstances.map((panelId, index) => (
              <div
                key={panelId}
                className={styles.rightPanelElement}
                style={{
                  maxWidth: analysisInstances.length > 1 ? "850px" : "none",
                }}
              >
                <AnalysisPanel
                  panelId={panelId}
                  initialDropdownOptions={dropdownOptions} // Pass initial options
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <Loader />}
    </>
  );
}
