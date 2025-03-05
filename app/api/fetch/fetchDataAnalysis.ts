export async function fetchAnalysisData(selectedAnalysis: string) {
    const response = await fetch(`http://localhost:9090/${selectedAnalysis}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    console.log('Request successful', data);
    return data;
  }