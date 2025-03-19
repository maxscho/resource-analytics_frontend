"use client";

import styles from "../styles/components/AnalysisDropdown.module.css";
import React from "react";

interface AnalysisDropdownProps {
  selectedAnalysis: string;
  setSelectedAnalysis: (analysis: string) => void;
  showFilterSelector: boolean;
  setShowFilterSelector: (show: boolean) => void;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
}

const options = [
  { value: "", label: "No Analysis" },
  { value: "", label: "Resource Allocation", disabled: true },
  { value: "units", label: "Unique Resources" },
  { value: "resource_roles", label: "Roles per Resource" },
  { value: "resources_per_activity", label: "Resources per Activity" },
  { value: "activities_per_role", label: "Activities per Role" },
  { value: "", label: "Case Duration", disabled: true },
  { value: "duration_per_role", label: "Duration per Role" },
  { value: "resource_within_role_norm", label: "Duration per Role and Resource" },
  { value: "duration_per_activity", label: "Duration per Activity" },
  { value: "activity_average_duration", label: "Duration per Activity and Role (Heatmap)" },
  { value: "activity_resource_comparison", label: "Duration per Activity and Resource" },
  { value: "activity_resource_comparison_norm", label: "Duration per Activity and Resource (Heatmap)" },
  { value: "", label: "Workload Distribution", disabled: true },
  { value: "resource_role_time_distribution", label: "Role by Resource" },
  { value: "resource_time_distribution", label: "Activity by Resource" },
  { value: "role_time_distribution", label: "Activity by Role" },
  { value: "", label: "Capacity Utilization", disabled: true },
  { value: "capacity_utilization_resource", label: "Resource Capacity Utilization" },
  { value: "capacity_utilization_role", label: "Role Capacity Utilization" },
  { value: "capacity_utilization_activity",
    label: "Activity Capacity Utilization" }
];

export default function AnalysisDropdown({ selectedAnalysis, setSelectedAnalysis, showFilterSelector, setShowFilterSelector, showColumnSelector, setShowColumnSelector }: AnalysisDropdownProps) {

  return (
    <div>
      <p>Select the analysis</p>
      <select
        id="analysisDropdown"
        className={styles.customSelect}
        value={selectedAnalysis}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedAnalysis(e.target.value);
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={`${styles.iconButton}`}
        data-bs-toggle="modal"
        data-bs-target="#infoModal"
        hidden={!selectedAnalysis}
      >
        <i className="bi bi-info-circle"></i>
      </button>
      <button
        className="btn btn-primary"
        style={{ marginLeft: "15px" }}
        hidden={!selectedAnalysis}
        onClick={() => { setShowFilterSelector(!showFilterSelector); setShowColumnSelector(false); }}>
          <span>Show Table Filter</span>
            {showFilterSelector ? (
              <i className="bi bi-chevron-up ms-2 fs-6"></i>
            ) : (
              <i className="bi bi-chevron-down ms-2 fs-6"></i>
            )}
      </button>
    </div>
  );
}
