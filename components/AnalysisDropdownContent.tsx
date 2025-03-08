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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Default number of rows per page

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const totalPages = data?.table
    ? Math.ceil(data.table.length / rowsPerPage)
    : 1;
  const currentTableData = data?.table
    ? data.table.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : [];

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
            <button
              onClick={() =>
                setShowColumnSelector(
                  (prevShowColumnSelector) => !prevShowColumnSelector
                )
              }
            >
              {showColumnSelector ? (
                <i className="bi bi-arrow-up-square"></i>
              ) : (
                <i className="bi bi-arrow-down-square"></i>
              )}
            </button>
            <label htmlFor="rowsPerPage" style={{ marginRight: "10px" }}>
              Rows per page:
            </label>
            <input
              type="number"
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={{ width: "60px" }}
              min="1"
            />
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
              {currentTableData.map((row, rowIndex) => (
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
          { totalPages > 1 && <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i> Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next <i className="bi bi-chevron-right"></i>
            </button>
          </div> }
        </div>
      )}
      {data?.plot && <div id="plot"></div>}
      {data?.big_plot && <div id="big_plot"></div>}
    </div>
  );
};

export default AnalysisDropdownContent;
