# :busts_in_silhouette::bar_chart: RESOURCE ANALYTICS TOOL - Frontend

The following **Resource Analytics Tool** is a web-based application for analyzing resource-related insights from event logs. It visualizes metrics from four critical areas: resource allocation, resource performance, workload distribution, and capacity utilization using interactive plots and tables.

---

## :open_file_folder: Project Structure
```
.
├── app
│   ├── api
│   │   ├── fetch
│   │   │   └── fetchDataAnalysis.ts         # API call logic for data analysis
│   │   └── upload
│   │       └── route.ts                     # API route handler for file uploads
│   ├── components
│   │   ├── ActivityDetail.tsx              # Shows detailed activity insights
│   │   ├── AnalysisDropdown.tsx            # Dropdown selector for analysis types
│   │   ├── AnalysisDropdownContent.tsx     # Content panel selected in dropdown
│   │   ├── AnalysisPanel.tsx               # Core component for analysis views
│   │   ├── base-node.tsx                   # Base definition for flow nodes
│   │   ├── CustomEdge.tsx                  # Custom edges in React Flow
│   │   ├── DataTable.tsx                   # Table rendering data output
│   │   ├── DropdownElement.tsx             # Dropdown item component
│   │   ├── FileUpload.tsx                  # File upload UI
│   │   ├── FlowChartTooltip.tsx            # Tooltip for flowchart nodes
│   │   ├── Header.tsx                      # Application header bar
│   │   ├── InfoPanel.tsx                   # Overlay panel for analysis info
│   │   ├── Loader.tsx                      # Loading indicator
│   │   ├── OnboardingTutorial.tsx          # Guided user onboarding
│   │   ├── ReactFlowChart.tsx              # React Flow chart component
│   │   ├── TableComponent.tsx              # Wrapper around DataTable
│   │   ├── TableFilter.tsx                 # Filter component for tables
│   │   ├── TableFilterElement.tsx          # Element in filter dropdown
│   │   └── tooltip-node.tsx                # Tooltip behavior for nodes
│   ├── layout.tsx                          # Layout wrapper for all pages
│   ├── page.tsx                            # Main entry page
│   └── globals.css                         # Global styles
├── lib
│   └── utils.ts                            # Utility functions
├── models
│   ├── AnalysisData.ts                     # Type definitions for analysis results
│   ├── AnalysisType.ts                     # Enum/type for different analysis types
│   ├── DropdownElementType.ts              # Dropdown option model
│   ├── elkLayout.ts                        # Graph layout constants
│   ├── MetaEventData.ts                    # Metadata model for events
│   └── TableData.ts                        # Table row type definitions
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg                          # SVG icons for UI
├── styles
│   ├── components                          # Scoped component styles (.module.css)
│   └── data
│       └── StepList.ts                     # Onboarding step configuration
├── Dockerfile                              # Docker setup for frontend
├── next.config.ts                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind CSS setup
├── postcss.config.mjs                      # PostCSS configuration
├── package.json                            # Project metadata and dependencies
├── tsconfig.json                           # TypeScript configuration
├── .dockerignore                           # Docker ignore file
├── .gitignore                              # Git ignore file
└── README.md                               # Project documentation (this file)
```
---

## :rocket: Features
- Upload event logs (CSV)
- Perform interactive visual analytics:
    - Resource allocation
    - Case duration statistics
    - Workload distribution
    - Capacity utilization
- Process model visualization
- Responsive web UI using Next.js

---

## :whale: Docker Usage

1. Run the backend container: `docker run -it --rm -p 9090:9090 maxscho99/resource-analytics_backend:latest`
2. Run the container: `docker run --rm -p 3000:3000 maxscho99/resource-analytics_frontend:latest`
3. Access the interface: open your browser and navigate to: http://localhost:3000

---

## :page_facing_up: Input Requirements
Input logs **must be in CSV format** and include the following columns:

- `Case ID`           : Unique identifier per process   
- `Start Timestamp`   : Activity start time             
- `Complete Timestamp`: Activity end time               
- `Activity`          : Activity name                   
- `Resource`          : Resource name/identifier       
- `Role`              : Role of the resource            

---

## :brain: Analyses Types & Descriptions
After upload, choose from multiple analysis options in the dropdown. Categories include:

#### Resource Allocation

| **Analysis**               | **Description** |
|:---------------------------|:----------------|
| **Unique Resources**       | Counts the number of distinct resources involved in the event log. |
| **Roles per Resource**     | Displays how many roles each resource has taken on. |
| **Resources per Activity** | Shows how many different resources performed each activity. |
| **Activities per Role**    | Summarizes which and how many activities are carried out by each role. |

---

#### Case Duration

| **Analysis**                                      | **Description** |
|:--------------------------------------------------|:----------------|
| **Duration per Role**                             | Average case duration broken down by the role of the executing resource. |
| **Duration per Role and Resource**                | Average case duration for each combination of role and resource. |
| **Duration per Activity**                         | Average case duration per activity. |
| **Duration per Activity and Role (Heatmap)**      | Heatmap of average case durations for each activity-role pair. |
| **Duration per Activity and Resource**            | Displays average case duration per resource for each activity. |
| **Duration per Activity and Resource (Heatmap)**  | Heatmap of average case durations for each activity-resource pair. |
| **Duration per Activity and Resource by Role (Heatmap)** | Heatmaps fof average case durations for each activity-resource pair within a role. |

---

#### Workload Distribution

| **Analysis**            | **Description** |
|:-------------------------|:----------------|
| **Role by Resource**     | Proportion of time each individual resource spent performing different roles in relation to their total time available. |
| **Activity by Resource** | How each resource distributed their time across their assigned activities. |
| **Activity by Role**     | Similar to above, but aggregated by role instead of resource. |

---

#### Capacity Utilization

| **Analysis**                      | **Description** |
|:----------------------------------|:----------------|
| **Resource Capacity Utilization** | Shows how effectively each individual resource's available working time is utilized by comparing their actual task duration against an estimated total available time per day. |
| **Role Capacity Utilization**     | Aggregates capacity utilization across all resources assigned to a given role, indicating how intensively the collective time of that role is used in the process. |
| **Activity Capacity Utilization** | Measures how much time resources theoretically allocated to each activity compared to the actual time spent. |



Each option triggers a backend API to generate plots and tables using Plotly and Tabulator.