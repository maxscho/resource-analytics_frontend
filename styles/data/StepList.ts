import { Step } from "react-joyride";

export const stepList: Step[] = [
  {
    target: ".processOverviewButton",
    content:
      "This button lets you hide or show the process overview to gain more space for the analysis panels.",
  },
  {
    target: "#fetchButton",
    content:
      "This button lets you upload the event log file. The event log will be processed and a dfg will be created. Furthermore they are the basis for all your analysis.",
  },
  {
    target: "#analysisSelectionPanel",
    content:
      "This dropdown lets you select the choosen analysis type. With the info-button you can get more information about the analysis.",
  },
  {
    target: ".addAnalysisButton",
    content:
      "This button lets you add a new analysis panel. All analysis panels are independent from one another.",
  },
  {
    target: "#analysisFilterPanel",
    content:
      "This panel lets you filter the analysis, by filter the event log dataset. Therefore, both the analysis table and the plots are affected by this filter.",
  },
  {
    target: "#tableControlsPanel",
    content:
      "This panel lets you control the analysis table. You can show/hide columns from the table, set filter for each column and reset the selected row.",
  },
  {
    target: "#resetSelectedRowButton",
    content:
      "This button lets you reset the selection from the table or from the plot.",
  },
  {
    target: "#searchQuery",
    content:
      "This text input lets you search across the whole table. Both numbers and strings are supported.",
  },
];