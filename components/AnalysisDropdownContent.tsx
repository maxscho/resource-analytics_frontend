"use client";

import React, { useEffect, useState } from "react";
import { fetchAnalysisData } from "@/app/api/fetch/fetchDataAnalysis";

interface AnalysisData {
  image?: string;
  text?: string;
  table?: any[];
  plot?: string;
  big_plot?: string;
}

interface AnalysisDropdownContentProps {
  selectedAnalysis: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AnalysisDropdownContent = ({
  selectedAnalysis,
  isLoading,
  setIsLoading,
}: AnalysisDropdownContentProps) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [initialHeaders, setInitialHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAnalysis) return;
      setIsLoading(true);

      try {
        const data = await fetchAnalysisData(selectedAnalysis);
        setData(data);
        if (data.table) {
          const headers = Object.keys(data.table[0] || {});
          setInitialHeaders(headers);
          setSelectedHeaders(headers);
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedAnalysis, setIsLoading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (data?.plot && window.Plotly) {
        const figure = JSON.parse(data.plot);
        window.Plotly.newPlot("plot", figure.data, figure.layout);
      }

      if (data?.big_plot && window.Plotly) {
        const bigFigure = JSON.parse(data.big_plot);
        window.Plotly.newPlot("big_plot", bigFigure.data, bigFigure.layout);
      }
    }
  }, [data]);

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedHeaders((prevSelectedHeaders) =>
      checked
        ? [...prevSelectedHeaders, value]
        : prevSelectedHeaders.filter((header) => header !== value)
    );
  };

  return (
    <div>
      {data?.image && (
        <img
          src={`data:image/jpeg;base64,${data.image}`}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      {data?.text && <p>{data.text}</p>}
      {data?.table && (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "10px" }}>Visible columns</p>
              <button onClick={() => setShowColumnSelector((prevShowColumnSelector) => !prevShowColumnSelector)}>
                {showColumnSelector ? (
                <i className="bi bi-arrow-up-square"></i>
                ) : (
                <i className="bi bi-arrow-down-square"></i>
                )}
              </button>
            </div>
          {showColumnSelector && (
            <div>
              {initialHeaders.map((key) => (
                <div key={key}>
                  <input
                    type="checkbox"
                    id={key}
                    value={key}
                    checked={selectedHeaders.includes(key)}
                    onChange={handleHeaderChange}
                  />
                  <label htmlFor={key}>{key}</label>
                </div>
              ))}
            </div>
          )}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                {initialHeaders
                  .filter((key) => selectedHeaders.includes(key))
                  .map((key) => (
                    <th
                      key={key}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.table.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {initialHeaders
                    .filter((key) => selectedHeaders.includes(key))
                    .map((key) => (
                      <td
                        key={key}
                        style={{ border: "1px solid #ddd", padding: "8px" }}
                      >
                        {row[key] as React.ReactNode}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data?.plot && <div id="plot"></div>}
      {data?.big_plot && <div id="big_plot"></div>}
    </div>
  );
};

export default AnalysisDropdownContent;
