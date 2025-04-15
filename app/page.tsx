"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import styles from "../styles/components/pages.module.css";
import Head from "next/head";
import AnalysisPanel from "../components/AnalysisPanel";
import { v4 as uuidv4 } from "uuid";
import ReactFlowChart from "@/components/ReactFlowChart";
import { Edge, Node, ReactFlowProvider } from "reactflow";

export default function Home() {
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [metaData, setMetaData] = useState<MetaEventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    metrics: [] as { label: string; value: string }[],
    resources: [] as { label: string; value: string }[],
    roles: [] as { label: string; value: string }[],
    activities: [] as { label: string; value: string }[],
  });
  const [showProcessOverview, setShowProcessOverview] = useState(true);
  const [analysisInstances, setAnalysisInstances] = useState<string[]>([uuidv4(),]);
  const [nodeSelectData, setNodeSelectData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [initialPanelId, setInitialPanelId] = useState<string | null>(null);
  const [showUploadMenue, setShowUploadMenue] = useState(true);

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
      const response = await fetch(
        `http://localhost:9090/upload?panel_id=${analysisInstances[0]}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Upload Response:", data);

      // Set other metadata
      setMetaData(data.table);
      setDropdownOptions({
        metrics: [],
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

      if (data.dfg) {
        setFlowNodes(data.dfg.nodes);
        setFlowEdges(data.dfg.edges);
      }
      setShowUploadMenue(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setInitialPanelId(analysisInstances[0]);
      setIsLoading(false);
    }
  };

  const handleNodeSelect = async (node: Node) => {

    const response = await fetch(
      "http://localhost:9090/node_selection_detail",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity: node.data.label,
          panel_id: analysisInstances[0],
        }),
      }
    );

    const data = await response.json();
    setNodeSelectData(data);
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
      </Head>

      <div className={styles.placeholder}>
        <div className={styles.layoutNavigation}>
          <div className={styles.alignLeft}>
            <button
              onClick={() => setShowProcessOverview(!showProcessOverview)}
              className={`btn btn-primary btn-sm ${styles.buttonElement}`}
            >
              {showProcessOverview ? "Hide" : "Show"} Process Overview
            </button>
            {showProcessOverview && !showUploadMenue && (
              <button
                onClick={() => setShowUploadMenue(true)}
                className="btn btn-primary btn-sm"
              >
                Upload New Event Log
              </button>
            )}
          </div>
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
                className={`btn btn-danger btn-sm`}
              >
                Remove Analysis Panel
              </button>
            )}
          </div>
        </div>

        <div className={styles.container}>
          {showProcessOverview && (
            <div className={styles.leftPanel}>
              {(metaData.length > 0 && !showUploadMenue) ? (
                <DataTable data={metaData} />
              ) : (
                <FileUpload onUpload={handleUpload} />
              )}
              {flowNodes.length > 0 && (
                <ReactFlowProvider>
                  <ReactFlowChart
                    initialNodes={flowNodes}
                    initialEdges={flowEdges}
                    onNodeSelect={handleNodeSelect}
                  />
                </ReactFlowProvider>
              )}
            </div>
          )}
          { metaData.length > 0 && (

            <div
            className={styles.rightPanel}
            style={{ width: showProcessOverview ? "70%" : "100%" }}
            >
            {analysisInstances.map((panelId) => (
              <div
                key={panelId}
                className={styles.rightPanelElement}
                style={{
                  maxWidth: analysisInstances.length > 1 ? "850px" : "none",
                }}
              >
                <AnalysisPanel
                  panelId={panelId}
                  initialDropdownOptions={dropdownOptions}
                  setIsLoading={setIsLoading}
                  nodeSelectData={
                    panelId === initialPanelId ? nodeSelectData : null
                  }
                  setNodeSelectData={setNodeSelectData}
                  initialPanelId={initialPanelId}
                />
              </div>
            ))}
            </div>
          )}

        </div>
      </div>

      {isLoading && <Loader />}
    </>
  );
}
