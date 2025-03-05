"use client"; // Mark this as a Client Component

import styles from "../styles/components/AnalysisDropdown.module.css";

interface AnalysisDropdownProps {
  selectedAnalysis: string;
  setSelectedAnalysis: (analysis: string) => void;
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
    label: "Duration per Role and Resource"
  },
  { value: "duration_per_activity", label: "Duration per Activity" },
  {
    value: "activity_average_duration",
    label: "Duration per Activity and Role (Heatmap)"
  },
  {
    value: "activity_resource_comparison",
    label: "Duration per Activity and Resource",
  },
  {
    value: "activity_resource_comparison_norm",
    label: "Duration per Activity and Resource (Heatmap)"
  },
  { value: "", label: "Workload Distribution", disabled: true },
  { value: "resource_role_time_distribution", label: "Role by Resource" },
  { value: "resource_time_distribution", label: "Activity by Resource" },
  { value: "role_time_distribution", label: "Activity by Role" },
  { value: "", label: "Capacity Utilization", disabled: true },
  {
    value: "capacity_utilization_resource",
    label: "Resource Capacity Utilization"
  },
  { value: "capacity_utilization_role", label: "Role Capacity Utilization" },
  {
    value: "capacity_utilization_activity",
    label: "Activity Capacity Utilization"
  },
];

export default function AnalysisDropdown({
  selectedAnalysis,
  setSelectedAnalysis,
}: AnalysisDropdownProps) {
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
    </div>
  );
}
