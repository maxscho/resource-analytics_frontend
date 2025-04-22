import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/components/AnalysisDropdownContent.module.css";
import TableFilter from "./TableFilter";

interface TableComponentProps {
  initialHeaders: string[];
  selectedHeaders: string[];
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleHeaderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  totalPages: number;
  currentTableData: any[];
  showFilterSelector: boolean;
  selectedAnalysis: string;
  setShowFilterSelector: (show: boolean) => void;
  setSelectedRow: (row: any) => void;
  selectedRow: any;
  selectionSource: "plot" | "table" | null;
  setSelectionSource: React.Dispatch<React.SetStateAction<"plot" | "table" | null>>;
}

const TableComponent: React.FC<TableComponentProps> = ({
  initialHeaders,
  selectedHeaders,
  showColumnSelector,
  setShowColumnSelector,
  rowsPerPage,
  setRowsPerPage,
  searchQuery,
  setSearchQuery,
  handleHeaderChange,
  handleSelectAllChange,
  handlePageChange,
  currentPage,
  totalPages,
  currentTableData,
  showFilterSelector,
  setShowFilterSelector,
  selectedAnalysis,
  setSelectedRow,
  selectedRow,
  selectionSource,
  setSelectionSource,
}) => {
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    [key: string]: { selectedRadio: string; filterValue: number | string };
  }>({});
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedRowAbsoluteIndex, setSelectedRowAbsoluteIndex] = useState<number | null>(null);
  const hasJumpedToPlotSelection = useRef(false);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;

    if (inputValue === "") {
      setRowsPerPage(0);
      return;
    }

    const newRowsPerPage = parseInt(inputValue, 10);

    if (!isNaN(newRowsPerPage) && newRowsPerPage > 0) {
      setRowsPerPage(newRowsPerPage);
      handlePageChange(1);
    }
  };

  const handleRowsPerPageBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setRowsPerPage(10);
    }
  };

  const isNumeric = (value: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return !isNaN(value - parseFloat(value));
  };

  useEffect(() => {
    const numericColumns = initialHeaders.filter((key) =>
      currentTableData.some((row) => isNumeric(row[key]))
    );
    setNumericColumns(numericColumns);
  }, [initialHeaders, currentTableData]);

  const handleFiltersChange = (updatedFilters: {
    [key: string]: { selectedRadio: string; filterValue: number | string };
  }) => {
    setFilters(updatedFilters);
  };

  const applyFilters = (data: typeof currentTableData) => {
    return data.filter((row) => {
      return Object.entries(filters).every(
        ([columnName, { selectedRadio, filterValue }]) => {
          if (!filterValue || !selectedRadio) return true; // Skip if no filter is applied
          const cellValue = row[columnName as keyof typeof row];
          if (selectedRadio === ">") return cellValue > Number(filterValue);
          if (selectedRadio === "<") return cellValue < Number(filterValue);
          if (selectedRadio === "=") return cellValue === Number(filterValue);
          return true;
        }
      );
    });
  };

  const filteredData = applyFilters(currentTableData);

  useEffect(() => {
    if (!selectedRow) {
      setSelectedRowIndex(null);
      setSelectedRowAbsoluteIndex(null);
      hasJumpedToPlotSelection.current = false;
      return;
    }
    const idx = filteredData.findIndex(
      (row) => JSON.stringify(row) === JSON.stringify(selectedRow)
    );
    setSelectedRowAbsoluteIndex(idx);

    if (idx !== -1) {
      const page = Math.floor(idx / rowsPerPage) + 1;
      if (
        selectionSource === "plot" &&
        page !== currentPage &&
        !hasJumpedToPlotSelection.current
      ) {
        hasJumpedToPlotSelection.current = true;
        handlePageChange(page);
        setSelectionSource && setSelectionSource(null);
      } else if (page === currentPage) {
        setSelectedRowIndex(idx % rowsPerPage);
        hasJumpedToPlotSelection.current = false; // Reset after landing on correct page
      }
    } else {
      setSelectedRowIndex(null);
      hasJumpedToPlotSelection.current = false;
    }
  }, [selectedRow, filteredData, rowsPerPage, selectionSource, currentPage]);

  useEffect(() => {
    if (
      selectedRowAbsoluteIndex !== null &&
      Math.floor(selectedRowAbsoluteIndex / rowsPerPage) + 1 === currentPage
    ) {
      setSelectedRowIndex(selectedRowAbsoluteIndex % rowsPerPage);
    } else {
      setSelectedRowIndex(null);
    }
  }, [currentPage, rowsPerPage, selectedRowAbsoluteIndex]);

  return (
    <div className={styles.tableContent}>
      {showFilterSelector ? (
        // either show the table filter or table controls
        <TableFilter
          numericColumns={numericColumns}
          onFiltersChange={handleFiltersChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handlePageChange={handlePageChange}
          selectedAnalysis={selectedAnalysis}
          setShowFilterSelector={setShowFilterSelector}
          showFilterSelector={showFilterSelector}
          setShowColumnSelector={setShowColumnSelector}
        />
      ) : (
        <div className={styles.tableControlsPanel}>
          <div className={styles.columnSelectorBar}>
            <button
              id="selectionButton"
              style={{ height: "38px" }}
              className={`btn btn-secondary d-flex align-items-center ${styles.iconButton}`}
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              <span>Visible Columns</span>
              {showColumnSelector ? (
                <i className="bi bi-chevron-up ms-2 fs-6"></i>
              ) : (
                <i className="bi bi-chevron-down ms-2 fs-6"></i>
              )}
            </button>
          </div>
          <div className={styles.paginationBar}>
            <label htmlFor="rowsPerPage" style={{ marginRight: "10px" }}>
              Rows page:
            </label>
            <input
              type="number"
              id="rowsPerPage"
              className={`form-control ${styles.noSpinner}`}
              value={rowsPerPage === 0 ? "" : rowsPerPage}
              onChange={handleRowsPerPageChange}
              onBlur={handleRowsPerPageBlur}
              style={{ width: "50px" }}
              min="1"
              onFocus={(e) => e.target.select()}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ marginLeft: "15px" }}
            hidden={!selectedAnalysis}
            onClick={() => {
              setShowFilterSelector(!showFilterSelector);
              setShowColumnSelector(false);
            }}
          >
            <span>Table Filter</span>
            {showFilterSelector ? (
              <i className="bi bi-chevron-up ms-2 fs-6"></i>
            ) : (
              <i className="bi bi-chevron-down ms-2 fs-6"></i>
            )}
          </button>
          
            <button
              className="btn btn-primary"
              style={{ marginLeft: "15px" }}
              onClick={() => {
                setSelectedRowIndex(null);
                setSelectedRow && setSelectedRow(null);
              }}
            >
              Reset Selected Row
          </button>
          
        </div>
      )}
      {showColumnSelector && (
        // Selector for visible columns
        <div
          className={`custom-control custom-checkbox ${styles.columnSelectorDropdown}`}
        >
          <div>
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedHeaders.length === initialHeaders.length}
              onChange={handleSelectAllChange}
              className={`custom-control-input ${styles.columnSelectorCheckbox}`}
            />
            <label style={{ paddingLeft: "5px" }} htmlFor="selectAll">
              <b>View all Columns</b>
            </label>
          </div>
          {initialHeaders.map((key) => (
            <div key={key}>
              <input
                type="checkbox"
                id={key}
                value={key}
                checked={selectedHeaders.includes(key)}
                onChange={handleHeaderChange}
                className={`custom-control-input ${styles.columnSelectorCheckbox}`}
              />
              <label style={{ paddingLeft: "5px" }} htmlFor={key}>
                {key}
              </label>
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
          {filteredData
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => {
                  setSelectedRowIndex(rowIndex);
                  setSelectedRow && setSelectedRow(row);
                  setSelectionSource && setSelectionSource("table");
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedRowIndex === rowIndex ? "#e0e7ff" : undefined,
                }}
              >
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
      {totalPages > 1 && (
        // Pagination controls
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
