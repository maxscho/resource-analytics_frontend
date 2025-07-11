import { useState } from "react";
import AnalysisDropdown from "./AnalysisDropdown";
import InfoPanel from "./InfoPanel";
import AnalysisDropdownContent from "./AnalysisDropdownContent";
import styles from "../styles/components/Home.module.css";
import { AnalysisData } from "../models/AnalysisData";

interface AnalysisPanelProps {
  panelId: string;
  initialDropdownOptions: {
    metrics: { label: string; value: string }[];
    resources: { label: string; value: string }[];
    roles: { label: string; value: string }[];
    activities: { label: string; value: string }[];
  };
  nodeSelectData?: AnalysisData;
  setNodeSelectData?: (data: AnalysisData) => void;
  initialPanelId?: string | null;
  setIsLoading: (isLoading: boolean) => void;
  setAnalysisSelected: (analysisSelected: boolean) => void;
  setAnalysisPanelControl: (analysisPanelControl: boolean) => void;
  selectedAnalysis?: string; // made optional
  setSelectedAnalysis?: (analysis: string) => void; // made optional
}

export default function AnalysisPanel({
  panelId,
  initialDropdownOptions,
  nodeSelectData,
  setNodeSelectData,
  initialPanelId,
  setIsLoading,
  setAnalysisSelected,
  setAnalysisPanelControl,
  selectedAnalysis,
  setSelectedAnalysis,
}: AnalysisPanelProps) {
  const [dropdownOptions] = useState(initialDropdownOptions);

  // Internal state for uncontrolled mode
  const [internalSelectedAnalysis, setInternalSelectedAnalysis] =
    useState<string>("");

  // Use controlled or uncontrolled state
  const analysisValue =
    selectedAnalysis !== undefined
      ? selectedAnalysis
      : internalSelectedAnalysis;
  const setAnalysisValue =
    setSelectedAnalysis !== undefined
      ? setSelectedAnalysis
      : setInternalSelectedAnalysis;

  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
  const [showFilterSelector, setShowFilterSelector] = useState<boolean>(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [initialHeaders, setInitialHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);

  return (
    <div className={`${styles.rounded} ${styles.rightPanel}`}>
      <AnalysisDropdown
        setAnalysisSelected={setAnalysisSelected}
        panelId={panelId}
        selectedAnalysis={analysisValue}
        setSelectedAnalysis={setAnalysisValue}
        setData={setData}
        setInitialHeaders={setInitialHeaders}
        setSelectedHeaders={setSelectedHeaders}
        dropdownOptions={dropdownOptions}
        nodeSelectData={nodeSelectData}
        setNodeSelectData={setNodeSelectData}
        initialPanelId={initialPanelId}
      />
      <InfoPanel selectedAnalysis={analysisValue} />
      <AnalysisDropdownContent
        panelId={panelId}
        selectedAnalysis={analysisValue}
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
        nodeSelectData={nodeSelectData}
        setAnalysisPanelControl={setAnalysisPanelControl}
      />
    </div>
  );
}
