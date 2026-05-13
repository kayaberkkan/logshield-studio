import { TopBar } from './components/layout/TopBar';
import { DropZone } from './components/upload/DropZone';
import { ToastContainer } from './components/common/Toast';
import { useAnalysisStore } from './stores/analysisStore';
import './stores/settingsStore'; 
import './index.css';

import { AnalysisView } from './components/analysis/AnalysisView';

export default function App() {
  const analysisResult = useAnalysisStore((s) => s.analysisResult);

  return (
    <div className="app-shell">
      <TopBar />

      <main className="app-main">
        {!analysisResult ? (
          <DropZone />
        ) : (
          <AnalysisView />
        )}
      </main>

      <ToastContainer />
    </div>
  );
}
