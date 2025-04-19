export async function fetchAnalysisData(selectedAnalysis: string, panelId: string) {
  const response = await fetch(`http://localhost:9090/${selectedAnalysis}?panel_id=${panelId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    //console.log('Request successful', data);
    return data;
  }