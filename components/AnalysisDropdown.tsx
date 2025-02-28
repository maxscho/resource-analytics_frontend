// components/AnalysisDropdown.tsx
'use client'; // Mark this as a Client Component

import { useState } from 'react';
import styles from '../styles/components/AnalysisDropdown.module.css';

interface AnalysisDropdownProps {
  onAnalysisChange: (analysis: string) => void;
}

export default function AnalysisDropdown({ onAnalysisChange }: AnalysisDropdownProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnalysis(event.target.value);
    onAnalysisChange(event.target.value);
  };

  return (
    <div>
      <p>Select the analysis</p>
      <select id="analysisDropdown" className={styles.customSelect} value={selectedAnalysis} onChange={handleChange}>
        <option value="">No Analysis</option>
        <option value="" disabled>Resource Allocation</option>
        <option value="units">Unique Resources</option>
        <option value="resource_roles">Roles per Resource</option>
        <option value="resources_per_activity">Resources per Activity</option>
        <option value="activities_per_role">Activities per Role</option>
        <option value="" disabled>Case Duration</option>
        <option value="duration_per_role">Duration per Role</option>
        <option value="resource_within_role_norm">Duration per Role and Resource</option>
        <option value="duration_per_activity">Duration per Activity</option>
        <option value="activity_average_duration">Duration per Activity and Role (Heatmap)</option>
        <option value="activity_resource_comparison">Duration per Activity and Resource</option>
        <option value="activity_resource_comparison_norm">Duration per Activity and Resource (Heatmap)</option>
        <option value="" disabled>Workload Distribution</option>
        <option value="resource_role_time_distribution">Role by Resource</option>
        <option value="resource_time_distribution">Activity by Resource</option>
        <option value="role_time_distribution">Activity by Role</option>
        <option value="" disabled>Capacity Utilization</option>
        <option value="capacity_utilization_resource">Resource Capacity Utilization</option>
        <option value="capacity_utilization_role">Role Capacity Utilization</option>
        <option value="capacity_utilization_activity">Activity Capacity Utilization</option>
      </select>
    </div>
  );
}