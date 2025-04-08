import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DataTable from "./DataTable";

interface ActivityDetailProps {
  nodeSelectData: any;
}

const ActivityDetail = ({ nodeSelectData }: ActivityDetailProps) => {
  const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
  const [parsedPlot, setParsedPlot] = useState<any>(null);

  useEffect(() => {
    if (nodeSelectData?.plot) {
      try {
        const parsed = JSON.parse(nodeSelectData.plot);
        setParsedPlot(parsed);
      } catch (err) {
        console.error("Failed to parse plot JSON:", err);
        setParsedPlot(null);
      }
    } else {
      setParsedPlot(null);
    }
  }, [nodeSelectData]);

  return (
    <div>
      {nodeSelectData?.table && (
        <DataTable
          data={nodeSelectData.table
            .map((row: any) =>
              Object.keys(row).map((key) => ({
                column: key,
                value: row[key],
              }))
            )
            .flat()}
          useHeader={false}
        />
      )}

      {parsedPlot ? (
        <Plot
          data={parsedPlot.data}
          layout={parsedPlot.layout}
          config={parsedPlot.config || {}}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler={true}
        />
      ) : nodeSelectData?.plot ? (
        <p style={{ color: "red" }}>Plot data is invalid or could not be parsed.</p>
      ) : null}
    </div>
  );
};

export default ActivityDetail;