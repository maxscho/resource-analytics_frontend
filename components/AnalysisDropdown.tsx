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
  setIsLoading: (isLoading: boolean) => void;
  initialHeaders: string[];
  setInitialHeaders: (headers: string[]) => void;
  selectedHeaders: string[];
  setSelectedHeaders: (headers: string[]) => void;
  data: AnalysisData | null;
  setData: (data: AnalysisData | null) => void;
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
  setIsLoading,
  initialHeaders,
  setInitialHeaders,
  selectedHeaders,
  setSelectedHeaders,
  data,
  setData,
}: AnalysisDropdownProps) {
  const [dropdownOptions, setDropdownOptions] = useState<{
    metrics: { label: string; value: string }[];
    resources: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    activities: { label: string; value: string }[];
  }>({
    metrics: [],
    resources: [],
    roles: [],
    activities: [],
  });

  // State to store selected values
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

  useEffect(() => {
    async function fetchDropdownOptions() {
      try {
        const response = await fetch("http://localhost:9090/filterValues", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dropdown options");
        }
        const data = await response.json();
        console.log("Fetched data:", data);

        // Map backend response to dropdownOptions state
        setDropdownOptions({
          metrics: (data.Metric || []).map((item: string) => ({
            label: item,
            value: item,
          })),
          resources: (data.Resource || []).map((item: string) => ({
            label: item,
            value: item,
          })),
          roles: (data.Role || []).map((item: string) => ({
            label: item,
            value: item,
          })),
          activities: (data.Activity || []).map((item: string) => ({
            label: item,
            value: item,
          })),
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    }
    fetchDropdownOptions();
  }, []);

  // Monitor changes to selected values
  useEffect(() => {
    console.log("Selected values:", selectedValues);
  }, [selectedValues]);

  // Effect to handle changes to selectedValues
  useEffect(() => {
    const sendFilterData = async () => {
      try {
        const response = await fetch("http://localhost:9090/filter_analysis", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedValues), // Use the latest state
        });

        if (!response.ok) {
          throw new Error("Failed to fetch filtered analysis data");
        }

        const filteredData = await response.json();
        console.log("Filtered Response:", filteredData);

        // After fetching filtered data, fetch data for the selected analysis
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

    // Call sendFilterData whenever selectedValues changes
    sendFilterData();
  }, [selectedValues, selectedAnalysis, setData, setInitialHeaders, setSelectedHeaders]);

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
