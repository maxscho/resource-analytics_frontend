import React from "react";
import styles from "@/styles/components/AnalysisDropdownContent.module.css";

interface TableComponentProps {
  initialHeaders: string[];
  selectedHeaders: string[];
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleHeaderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  totalPages: number;
  currentTableData: any[];
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
}) => {
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    handlePageChange(1);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
    handlePageChange(1);
  };

  return (
    <div className={styles.tableContent}>
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
            Rows per page:
          </label>
          <input
            type="number"
            id="rowsPerPage"
            className="form-control"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{ width: "50px" }}
            min="1"
            onFocus={(e) => e.target.select()}
          />
        </div>
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
        </div>
      </div>
      {showColumnSelector && (
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
      {totalPages > 1 && (
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
