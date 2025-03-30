"use client";

import React, { useEffect, useState } from "react";
import { fetchAnalysisData } from "@/app/api/fetch/fetchDataAnalysis";
import TableComponent from "./TableComponent";
import { AnalysisData } from "../models/AnalysisData";

interface AnalysisDropdownContentProps {
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
}

const AnalysisDropdownContent = ({
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
}: AnalysisDropdownContentProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAnalysis) {
        setData(null);
        return;
      }
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
    if (typeof window !== "undefined" && data?.plot && window.Plotly) {
      const figure = JSON.parse(data.plot);
      window.Plotly.newPlot("plot", figure.data, figure.layout);
    }

    if (typeof window !== "undefined" && data?.big_plot && window.Plotly) {
      const bigFigure = JSON.parse(data.big_plot);
      window.Plotly.newPlot("big_plot", bigFigure.data, bigFigure.layout);
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

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const totalPages = filteredTableData
    ? Math.ceil(filteredTableData.length / rowsPerPage)
    : 1;
  const currentTableData = filteredTableData
    ? filteredTableData.slice(
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
          currentTableData={currentTableData}
          showFilterSelector={showFilterSelector}
          selectedAnalysis={selectedAnalysis}
          setShowFilterSelector={setShowFilterSelector}
        />
      )}
      {data?.plot && <div id="plot"></div>}
      {data?.big_plot && <div id="big_plot"></div>}
    </div>
  );
};

export default AnalysisDropdownContent;
