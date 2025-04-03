import { useState } from "react";
import AnalysisDropdown from "./AnalysisDropdown";
import InfoPanel from "./InfoPanel";
import AnalysisDropdownContent from "./AnalysisDropdownContent";
import styles from "../styles/components/Home.module.css";
import { AnalysisData } from "../models/AnalysisData";

interface AnalysisPanelProps {
  dropdownOptions: {
    metrics: { label: string; value: string }[];
    resources: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    activities: { label: string; value: string }[];
  };
}

export default function AnalysisPanel({ dropdownOptions }: AnalysisPanelProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("");
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
  const [showFilterSelector, setShowFilterSelector] = useState<boolean>(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [initialHeaders, setInitialHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className={`${styles.rounded} ${styles.rightPanel}`}>
      <AnalysisDropdown
        selectedAnalysis={selectedAnalysis}
        setSelectedAnalysis={setSelectedAnalysis}
        setData={setData}
        setInitialHeaders={setInitialHeaders}
        setSelectedHeaders={setSelectedHeaders}
        dropdownOptions={dropdownOptions}
      />
      <InfoPanel selectedAnalysis={selectedAnalysis} />
      <AnalysisDropdownContent
        selectedAnalysis={selectedAnalysis}
        setIsLoading={setIsLoading}
        showFilterSelector={showFilterSelector}
        setShowFilterSelector={setShowFilterSelector}
        showColumnSelector={showColumnSelector}
        setShowColumnSelector={setShowColumnSelector}
        data={data}
        setData={setData}
        initialHeaders={initialHeaders}
        setInitialHeaders={setInitialHeaders}
        selectedHeaders={selectedHeaders}
        setSelectedHeaders={setSelectedHeaders}
      />
    </div>
  );
}