"use client";

import React, { useEffect, useState } from "react";
import { fetchAnalysisData } from "@/app/api/fetch/fetchDataAnalysis";
import styles from "@/styles/components/AnalysisDropdownContent.module.css";
import TableComponent from "./TableComponent";

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
  showFilterSelector: boolean;
  setShowFilterSelector: (show: boolean) => void;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
}

const AnalysisDropdownContent = ({
  selectedAnalysis,
  isLoading,
  setIsLoading,
  showFilterSelector,
  setShowFilterSelector,
  showColumnSelector,
  setShowColumnSelector
}: AnalysisDropdownContentProps) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [initialHeaders, setInitialHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
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
        />
      )}
      {data?.plot && <div id="plot"></div>}
      {data?.big_plot && <div id="big_plot"></div>}
    </div>
  );
};

export default AnalysisDropdownContent;
