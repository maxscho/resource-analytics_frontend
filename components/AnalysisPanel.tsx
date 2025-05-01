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
}: AnalysisPanelProps) {
  const [dropdownOptions] = useState(initialDropdownOptions);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("");
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
        selectedAnalysis={selectedAnalysis}
        setSelectedAnalysis={setSelectedAnalysis}
        setData={setData}
        setInitialHeaders={setInitialHeaders}
        setSelectedHeaders={setSelectedHeaders}
        dropdownOptions={dropdownOptions}
        nodeSelectData={nodeSelectData}
        setNodeSelectData={setNodeSelectData}
        initialPanelId={initialPanelId}
      />
      <InfoPanel selectedAnalysis={selectedAnalysis} />
      <AnalysisDropdownContent
        panelId={panelId}
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
        nodeSelectData={nodeSelectData}
        setAnalysisPanelControl={setAnalysisPanelControl}
      />
    </div>
  );
}