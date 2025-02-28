import 'plotly.js-dist';

declare global {
  interface Window {
    Plotly: typeof import('plotly.js');
  }
}