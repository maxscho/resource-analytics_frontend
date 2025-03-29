"use client";

import styles from "../styles/components/AnalysisDropdown.module.css";
import React from "react";
import DropdownElement from "./DropdownElement";
import { useEffect, useState } from "react";
import { fetchAnalysisData } from "@/app/api/fetch/fetchDataAnalysis";
import { AnalysisData } from "../models/AnalysisData";

interface AnalysisDropdownProps {
  selectedAnalysis: string;
  setSelectedAnalysis: (analysis: string) => void;
  setInitialHeaders: (headers: string[]) => void;
  setSelectedHeaders: (headers: string[]) => void;
  setData: (data: AnalysisData | null) => void;
  dropdownOptions: {
    metrics: { label: string; value: string }[];
    resources: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    activities: { label: string; value: string }[];
  };
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
  {
    value: "resource_within_role_norm",
    label: "Duration per Role and Resource",
  },
  { value: "duration_per_activity", label: "Duration per Activity" },
  {
    value: "activity_average_duration",
    label: "Duration per Activity and Role (Heatmap)",
  },
  {
    value: "activity_resource_comparison",
    label: "Duration per Activity and Resource",
  },
  {
    value: "activity_resource_comparison_norm",
    label: "Duration per Activity and Resource (Heatmap)",
  },
  { value: "", label: "Workload Distribution", disabled: true },
  { value: "resource_role_time_distribution", label: "Role by Resource" },
  { value: "resource_time_distribution", label: "Activity by Resource" },
  { value: "role_time_distribution", label: "Activity by Role" },
  { value: "", label: "Capacity Utilization", disabled: true },
  {
    value: "capacity_utilization_resource",
    label: "Resource Capacity Utilization",
  },
  { value: "capacity_utilization_role", label: "Role Capacity Utilization" },
  {
    value: "capacity_utilization_activity",
    label: "Activity Capacity Utilization",
  },
];

export default function AnalysisDropdown({
  selectedAnalysis,
  setSelectedAnalysis,
  setInitialHeaders,
  setSelectedHeaders,
  setData,
  dropdownOptions
}: AnalysisDropdownProps) {

  const [selectedValues, setSelectedValues] = useState<{
    metric: string;
    resource: string;
    role: string;
    activity: string;
  }>({
    metric: "",
    resource: "",
    role: "",
    activity: "",
  });

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {

    const sendFilterData = async () => {
      try {
        const response = await fetch("http://localhost:9090/filter_analysis", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedValues),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch filtered analysis data");
        }

        const filteredData = await response.json();
        console.log("Filtered Response:", filteredData);

        if (selectedAnalysis) {
          const analysisData = await fetchAnalysisData(selectedAnalysis);
          setData(analysisData);

          if (analysisData.table) {
            const headers = Object.keys(analysisData.table[0] || {});
            setInitialHeaders(headers);
            setSelectedHeaders(headers);
          }
        }
      } catch (error) {
        console.error("Error fetching filtered analysis data:", error);
      }
    };

    if (!isInitialRender) {
      // Only call sendFilterData if it's not the initial render otherwise session informatino is not set
      sendFilterData();
    } else {
      setIsInitialRender(false);
    }
  }, [selectedValues]);

  return (
    <div className={styles.container}>
      <div className={styles.analysisSelection}>
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
      </div>
      <div className={styles.analysisFilter}>
        <p>Analysis Filter</p>
        <div className={styles.dropdownElements}>
          <DropdownElement
            label="Metric"
            options={dropdownOptions.metrics}
            onChange={(value) => {
              setSelectedValues((prev) => ({ ...prev, metric: value }));
            }}
          />
          <DropdownElement
            label="Resource"
            options={dropdownOptions.resources}
            onChange={(value) => {
              setSelectedValues((prev) => ({ ...prev, resource: value }));
            }}
          />
          <DropdownElement
            label="Role"
            options={dropdownOptions.roles}
            onChange={(value) => {
              setSelectedValues((prev) => ({ ...prev, role: value }));
            }}
          />
          <DropdownElement
            label="Activity"
            options={dropdownOptions.activities}
            onChange={(value) => {
              setSelectedValues((prev) => ({ ...prev, activity: value }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
