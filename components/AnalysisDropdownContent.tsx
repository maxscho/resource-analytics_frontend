"use client";

import React, { useEffect, useState } from "react";
import { fetchAnalysisData } from "@/app/api/fetch/fetchDataAnalysis";
import TableComponent from "./TableComponent";
import { AnalysisData } from "../models/AnalysisData";
import ActivityDetail from "./ActivityDetail";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface AnalysisDropdownContentProps {
  panelId: string;
  selectedAnalysis: string;
  setIsLoading: (isLoading: boolean) => void;
  showFilterSelector: boolean;
  setShowFilterSelector: (show: boolean) => void;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  initialHeaders: string[];
  setInitialHeaders: (headers: string[]) => void;
  selectedHeaders: string[];
  setSelectedHeaders: React.Dispatch<React.SetStateAction<string[]>>;
  data: AnalysisData | null;
  setData: (data: AnalysisData | null) => void;
  nodeSelectData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AnalysisDropdownContent = ({
  panelId,
  selectedAnalysis,
  setIsLoading,
  showFilterSelector,
  setShowFilterSelector,
  showColumnSelector,
  setShowColumnSelector,
  initialHeaders,
  setInitialHeaders,
  selectedHeaders,
  setSelectedHeaders,
  data,
  setData,
  nodeSelectData,
}: AnalysisDropdownContentProps) => {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [parsedPlot, setParsedPlot] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [bigParsedPlot, setBigParsedPlot] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedRow, setSelectedRow] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectionSource, setSelectionSource] = useState<"plot" | "table" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAnalysis || selectedAnalysis === "analysis_detail") {
        setData(null);
        return;
      }
      setIsLoading(true);

      try {
        const data = await fetchAnalysisData(selectedAnalysis, panelId);
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
    if (data?.plot) {
      try {
        const parsed = JSON.parse(data.plot);
        setParsedPlot(parsed);
      } catch (err) {
        console.error("Failed to parse plot JSON:", err);
        setParsedPlot(null);
      }
    }
    if (data?.big_plot) {
      try {
        const parsed = JSON.parse(data.big_plot);
        setBigParsedPlot(parsed);
      } catch (err) {
        console.error("Failed to parse big plot JSON:", err);
        setBigParsedPlot(null);
      }
    }
  }, [data]);

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedHeaders((prevSelectedHeaders) => {
      const updatedHeaders = checked
        ? [...prevSelectedHeaders, value]
        : prevSelectedHeaders.filter((header) => header !== value);
      return [...new Set(updatedHeaders)];
    });
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (selectedHeaders.length === initialHeaders.length) {
      return;
    }
    setSelectedHeaders(checked ? initialHeaders : []);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredTableData = data?.table
    ? data.table.filter((row) =>
        initialHeaders.some((key) =>
          row[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  const handlePlotClick = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log("Plot clicked", event);
    if (!data?.table || !parsedPlot) return;

    const point = event.points[0];
    if (!point) return;

    const yKey = initialHeaders.find((header) => selectedHeaders.includes(header));
    if (!yKey) return;

    const clickedYValue = point.y;
    const matchedRow = filteredTableData.find((row) => row[yKey] === clickedYValue);

    if (matchedRow) {
      setSelectedRow(matchedRow);
      setSelectionSource("plot");
    }
  };

  const totalPages = filteredTableData
    ? Math.ceil(filteredTableData.length / rowsPerPage)
    : 1;

  return (
    <>
      {nodeSelectData ? (
        <ActivityDetail nodeSelectData={nodeSelectData} />
      ) : (
        <div>
          {data?.image && (
            <img
              src={`data:image/jpeg;base64,${data.image}`}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
          {data?.text && <p>{data.text}</p>}
          {data?.table && (
            <TableComponent
              initialHeaders={initialHeaders}
              selectedHeaders={selectedHeaders}
              showColumnSelector={showColumnSelector}
              setShowColumnSelector={setShowColumnSelector}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleHeaderChange={handleHeaderChange}
              handleSelectAllChange={handleSelectAllChange}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              totalPages={totalPages}
              currentTableData={filteredTableData} // pass the full filtered data
              showFilterSelector={showFilterSelector}
              selectedAnalysis={selectedAnalysis}
              setShowFilterSelector={setShowFilterSelector}
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
              selectionSource={selectionSource}
              setSelectionSource={setSelectionSource}
            />
          )}
          {parsedPlot && (
            <Plot
              data={parsedPlot.data.map((trace: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                if (selectedRow && trace.y && trace.y.length > 0) {
                  const yKey = initialHeaders.find((header) =>
                    selectedHeaders.includes(header)
                  );
                  const selectedYValue = yKey ? selectedRow[yKey] : null;
                  const highlightIndices = trace.y
                    .map((yVal: any, idx: number) => // eslint-disable-line @typescript-eslint/no-explicit-any
                      yVal === selectedYValue ? idx : -1
                    )
                    .filter((idx: number) => idx !== -1);

                  const colorArr = trace.y.map((_: any, idx: number) => // eslint-disable-line @typescript-eslint/no-explicit-any
                    highlightIndices.includes(idx)
                      ? "lightblue"
                      : trace.marker?.color || "blue"
                  );
                  const sizeArr = trace.y.map((_: any, idx: number) => // eslint-disable-line @typescript-eslint/no-explicit-any
                    highlightIndices.includes(idx)
                      ? 16
                      : trace.marker?.size || 8
                  );

                  return {
                    ...trace,
                    marker: {
                      ...trace.marker,
                      color: colorArr,
                      size: sizeArr,
                    },
                  };
                }
                return trace;
              })}
              layout={parsedPlot.layout}
              config={parsedPlot.config || {}}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler={true}
              onClick={handlePlotClick}
            />
          )}
          {bigParsedPlot && (
            <>
              <Plot
                data={bigParsedPlot.data}
                layout={bigParsedPlot.layout}
                config={bigParsedPlot.config || {}}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AnalysisDropdownContent;