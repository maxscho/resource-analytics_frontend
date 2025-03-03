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

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (analysis) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:9090/${analysis}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        let content = "";
        if (data.image) {
          content += `<img src="data:image/jpeg;base64,${data.image}" style="max-width:100%; height:auto;">`;
        }
        if (data.text) {
          content += `<p>${data.text}</p>`;
        }
        if (data.table) {
          content += `<div id="resultTable"></div>`;
        }
        if (data.plot) {
          content += `<div id="plot"></div>`;
        }
        if (data.big_plot) {
          content += `<div id="big_plot"></div>`;
        }

        const resultContainer = document.getElementById("resultContainer");
        if (resultContainer) {
          resultContainer.innerHTML = content;
        }

        if (data.table && window.Tabulator) {
          new window.Tabulator("#resultTable", {
            data: data.table,
            autoColumns: true,
            layout: "fitColumns",
          });
        }
        if (data.plot && window.Plotly) {
          const figure = JSON.parse(data.plot);
          window.Plotly.newPlot("plot", figure.data, figure.layout);
        }
        if (data.big_plot && window.Plotly) {
          const bigFigure = JSON.parse(data.big_plot);
          window.Plotly.newPlot("big_plot", bigFigure.data, bigFigure.layout);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
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

      <div className={styles.leftPanel}>
        <FileUpload onUpload={handleUpload} />
        <ImageViewer imageSrc={imageSrc} />
        <DataTable data={tableData} />
      </div>
      <div id="div4" className={styles.rounded}>
        <AnalysisDropdown onAnalysisChange={handleAnalysisChange} />
        <div id="resultContainer">
          {/* Results will be dynamically inserted here */}
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
