import React, { useState } from "react";
import TableFilterElement from "./TableFilterElement";
import styles from "@/styles/components/TableFilter.module.css";

interface TableFilterProps {
    numericColumns: string[];
    onFiltersChange: (filters: {
      [key: string]: { selectedRadio: string; filterValue: number | string };
    }) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handlePageChange: (newPage: number) => void;
    selectedAnalysis: string;
    showFilterSelector: boolean;
    setShowFilterSelector: (show: boolean) => void;
    setShowColumnSelector: (show: boolean) => void;
  }

const TableFilter = ({ 
    numericColumns,
    onFiltersChange,
    searchQuery,
    setSearchQuery,
    handlePageChange,
    selectedAnalysis,
    showFilterSelector,
    setShowFilterSelector,
    setShowColumnSelector
 }: TableFilterProps) => {

    const handleSearchQueryChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setSearchQuery(event.target.value);
        handlePageChange(1); // Reset to the first page when searching
      };

  const [filters, setFilters] = useState<{
    [key: string]: { selectedRadio: string; filterValue: number | string };
  }>({});

  const handleFilterChange = (
    columnName: string,
    selectedRadio: string,
    filterValue: number | string
  ) => {
    const updatedFilters = {
      ...filters,
      [columnName]: { selectedRadio, filterValue },
    };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <div
      style={{
        borderTop: "1px solid darkgrey",
        padding: "10px",
        marginTop: "10px",
      }}
    >
      <div className={styles.searchBar}>
        <input
          type="text"
          id="searchQuery"
          className={`form-control search-input ${styles.searchInput}`}
          placeholder="Search Table..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setSearchQuery("")}
          >
            &times;
          </button>
        )}
        <button
            className="btn btn-primary"
            style={{ marginLeft: "15px", whiteSpace: "nowrap" }}
            hidden={!selectedAnalysis}
            onClick={() => {
              setShowFilterSelector(!showFilterSelector);
              setShowColumnSelector(false);
            }}
          >
            <span>Show Table Filter</span>
            {showFilterSelector ? (
              <i className="bi bi-chevron-up ms-2 fs-6"></i>
            ) : (
              <i className="bi bi-chevron-down ms-2 fs-6"></i>
            )}
          </button>
      </div>
      {numericColumns.map((column) => (
        <TableFilterElement
          key={column}
          columnName={column}
          selectedRadio={filters[column]?.selectedRadio || ""}
          filterValue={filters[column]?.filterValue || ""}
          onFilterChange={handleFilterChange}
        />
      ))}
    </div>
  );
};

export default TableFilter;
